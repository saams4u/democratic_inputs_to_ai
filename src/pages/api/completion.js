
import { Configuration, OpenAIApi } from "openai";
import { cors, runMiddleware } from './middleware';

import { withNextSession } from "@/lib/session";
import { dbConnect } from "@/lib/lowDb";

import { promises as fs } from 'fs';
import path from 'path';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const USER_NAME = "Human";
const AI_NAME = "EquiBot";
const MEMORY_SIZE = 6;

export default withNextSession(async (req, res) => {
    await runMiddleware(req, res, cors);
    
    if (req.method === "POST") {
        const { stackKey } = req.query;
        const body = req.body;
        const prompt = body.prompt || "";

        const jsonDirectory = path.join(process.cwd(), 'public');

        const stacksContent = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
        const stacks = JSON.parse(stacksContent);
        
        const botsContent = await fs.readFile(jsonDirectory + '/bots.json', 'utf8');
        const bots = JSON.parse(botsContent);            

        const { user } = req.session;

        if (!configuration.apiKey) {
            return res.status(500).json({error: {message: "OpenAI API Key is missing!"}});
        }

        if (!user) {
            return res.status(500).json({error: {message: "Session is missing!"}});
        }

        let topic = stacks[stackKey]?.topic;
        
        if (!topic) {
            return res.status(400).json({ error: { message: "Invalid stackKey value" } });
        }

        try {
            const db = await dbConnect();

            db.data.messageHistory[user.uid] ||= [];
            db.data.messageHistory[user.uid].push(`${USER_NAME}: ${prompt}\n`);

            const aiPrompt = bots[stackKey]?.prompt;
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    { role: "assistant", content: topic },
                    { role: "user", content: aiPrompt + db.data.messageHistory[user.uid].join("") + "EquiBot:" },
                ],
                temperature: 0.7,
                max_tokens: 1024
            });

            const aiResponse = (completion.data.choices[0].message.content).trim();
            db.data.messageHistory[user.uid].push(`${AI_NAME}: ${aiResponse}\n`);

            if (db.data.messageHistory[user.uid].length > MEMORY_SIZE) {
                db.data.messageHistory[user.uid].splice(0,2);
            }

            await db.write();
            return res.status(200).json({result: aiResponse});

        } catch(e) {
            console.log(e.message);
            return res.status(500).json({error: {message: e.message}});
        }

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

            await db.write();
            return res.status(200).json({message: "History cleared!"});
        }

        return res.status(200).json({message: "Nothing to clear!"});

    } else {
        return res.status(500).json({error: {message: "Invalid API Route"}});
    }
})