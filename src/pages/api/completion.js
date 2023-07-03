
import { Configuration, OpenAIApi } from "openai";
import { withNextSession } from "@/lib/session";
import { dbConnect } from "@/lib/lowDb";
import { Queue } from 'bull';

import runMiddleware, { cors } from '@/pages/api/middleware';
import fs from 'fs';
import path from 'path';

const botsFilePath = path.join(process.cwd(), 'public', 'bots.json');
const botsData = fs.readFileSync(botsFilePath, 'utf8');
const bots = JSON.parse(botsData);

const USER_NAME = "Human";
const AI_NAME = "EquiBot";
const MEMORY_SIZE = 6;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);
const openaiQueue = new Queue('openai', process.env.REDIS_URL);

openaiQueue.process(async (job) => {
    const db = await dbConnect();

    try {
        const { stack, user, prompt, topic } = job.data;
        const aiPrompt = bots[stack].prompt + (db.data.messageHistory[user.uid] || []).join("") + "EquiBot:";
        
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            messages: [
                { role: "assistant", content: topic },
                { role: "user", content: aiPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1024
        });

        const aiResponse = (completion.data.choices[0].message.content).trim();
        
        db.data.messageHistory[user.uid] = db.data.messageHistory[user.uid] || [];
        db.data.messageHistory[user.uid].push(`${AI_NAME}: ${aiResponse}\n`);

        if (db.data.messageHistory[user.uid].length > MEMORY_SIZE) {
            db.data.messageHistory[user.uid].splice(0,2);
        }

        return aiResponse;
        
    } catch (error) {
        console.error(`Failed to process job ${job.id}. ${error}`);
        await db.delete(); // or other error handling strategy
    }
});

export default withNextSession(async (req, res) => {
    await runMiddleware(req, res, cors);

    if (req.method === "POST") {
        const { stack } = req.query;
        const body = req.body;
        const prompt = body.prompt || "";
        const href = req.body.href;

        const dataFilePath = path.join(process.cwd(), 'public', 'data.json');
        const dataRaw = fs.readFileSync(dataFilePath, 'utf8');
        const stacks = JSON.parse(dataRaw);        

        const { user } = req.session;

        if (!configuration.apiKey) {
            return res.status(500).json({error: {message: "OpenAI API Key is missing!"}});
        }

        if (!user) {
            return res.status(500).json({error: {message: "Session is missing!"}});
        }

        let topic;

        for (let topicKey in stacks) {
            if (topicKey == href.slice(-7)) {
                topic = stacks[topicKey].topic;
                break;
            }
        }

        if (!topic) {
            return res.status(400).json({ error: { message: "Invalid topicKey value" } });
        }

        const db = await dbConnect();
        db.data.messageHistory[user.uid] ||= [];
        db.data.messageHistory[user.uid].push(`${USER_NAME}: ${prompt}\n`);

        // Add the job to the queue
        const job = await openaiQueue.add({
            stack,
            user,
            prompt,
            topic,
            db
        });

        return res.status(202).json({ jobId: job.id });

    } else if (req.method === "PUT")  {
        const {uid} = req.query;

        if (!uid) {
            return res.status(500).json({error: {message: "Invalid uid provided!"}});
        }

        req.session.user = {
            uid
        };

        await req.session.save();

        return res.status(200).json(uid);

    } else if (req.method === "DELETE") {
        const { user } = req.session;

        if (user) {
            const db = await dbConnect();
            db.data.messageHistory[user.uid] = [];

            return res.status(200).json({message: "History cleared!"});
        }

        return res.status(200).json({message: "Nothing to clear!"});

    } else {
        return res.status(500).json({error: {message: "Invalid API Route"}});
    }
});