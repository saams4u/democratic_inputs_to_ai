
import { withNextSession } from "@/lib/session";
import { Configuration, OpenAIApi } from "openai";
import { cors, runMiddleware } from "./middleware";
import { dbConnect } from "@/lib/lowDb";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const USER_NAME = "Human";
const AI_NAME = "EquiBot";
const MEMORY_SIZE = 6;

export default withNextSession(async (req, res) => {
    await runMiddleware(req, res, cors);

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    const { user } = req.session;

    if (!user) {
        return res.status(500).json({error: {message: "Session is missing!"}});
    }

    if (req.method === "GET") {
        const db = await dbConnect();
        const history = db.data.messageHistory[user.id] || [];
        return res.status(200).json(history);
    }

    if (req.method === "POST") {
        const body = req.body;
        const prompt = body.prompt || "";
        const {stack} = req.query;

        if (!configuration.apiKey) {
            return res.status(500).json({error: {message: "OpenAI API Key is missing!"}});
        }

        try {
            const db = await dbConnect();

            db.data.messageHistory[user.id] = db.data.messageHistory[user.id] || [];
            db.data.messageHistory[user.id].push(`${USER_NAME}: ${prompt}\n`);

            const baseUrl = "https://democratic-inputs-to-ai-3bv6.vercel.app";
            const stacksResponse = await fetch(`${baseUrl}/data/stacks.json`);

            if (!stacksResponse.ok) {
                throw new Error(`Could not fetch stacks data: ${stacksResponse.statusText}`);
            }

            const stacksData = await stacksResponse.json();  
            const botsResponse = await fetch(`${baseUrl}/data/bots.json`);

            if (!botsResponse.ok) {
                throw new Error(`Could not fetch bots data: ${botsResponse.statusText}`);
            }

            const botsData = await botsResponse.json();

            const aiPrompt = botsData[stack].prompt;
            const topic = stacksData[stack].topic;

            if (!topic) {
                return res.status(400).json({ error: { message: "Invalid topicKey value" } });
            }

            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    { role: "assistant", content: topic },
                    { role: "user", content: aiPrompt + db.data.messageHistory[user.id].join("") + "EquiBot:" },
                ],
                temperature: 0.7,
                max_tokens: 50
            });

            const aiResponse = (completion.data.choices[0].message.content).trim();
            db.data.messageHistory[user.id].push(`${AI_NAME}: ${aiResponse}\n`);

            if (db.data.messageHistory[user.id].length > MEMORY_SIZE) {
                db.data.messageHistory[user.id].splice(0,2);
            }

            await db.write();
            return res.status(200).json({result: aiResponse});

        } catch(e) {
            console.log(e.message);
            return res.status(500).json({error: {message: e.message}});
        }

    } else if (req.method === "DELETE") {
        const body = req.body;
        const stack = body.stack;
    
        if (!stack) {
            return res.status(400).json({ error: { message: "Stack is not provided in request." } });
        }
    
        const db = await dbConnect();
        if (db.data.messageHistory[user.id]) {
            db.data.messageHistory[user.id] = [];
    
            await db.write();
            return res.status(200).json({message: "History cleared!"});
        }
    
        return res.status(200).json({message: "Nothing to clear!"});    

    } else {
        return res.status(500).json({error: {message: "Invalid API Route"}});
    }
});