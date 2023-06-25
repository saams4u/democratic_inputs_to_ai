
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';  // Import the 'fs' module
import path from 'path';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const AI_PROMPT = "The following is a conversation with Walt. Walt is helpful and creative. Walt's only knowledge is in setting up a democratic process for deciding what rules AI systems should follow, within the bounds defined by OpenAI and the law. He can only answer questions related to this knowledge. He only cares about this knowledge. Walt often provides real-world examples, mostly political and technical in nature. Walt helps participants understand the opinions of others. Walt ensures that the same arguments are not recycled. Walt can help with brainstorming."

export default async function completion(req, res) {
    if (req.method === "POST") {
        const body = req.body;
        const prompt = body.prompt || "";
        const href = req.body.href;

        const jsonDirectory = path.join(process.cwd(), 'vercel');
        const stacks = await fs.readFile(jsonDirectory + '/data.json', 'utf8');  
        
        res.status(200).json(stacks);

        for (let topicKey in stacks) {
            
            if (topicKey == href.slice(-7)) {
                    const topic = stacks[topicKey].topic;

                    // Proceed only if topic exists
                    if (!topic) {
                        return res.status(400).json({ error: { message: "Invalid topicKey value" } });
                    }

                    try {
                        const openai = new OpenAIApi(configuration);

                        const formatedPrompt = AI_PROMPT + "\n" + prompt + "\n" + "Walt:";

                        const completion = await openai.createChatCompletion({
                            model: "gpt-3.5-turbo-16k",
                            messages: [
                                { role: "system", content: topic },
                                { role: "user", content: formatedPrompt },
                            ],
                            temperature: 0.7,
                            max_tokens: 512
                        });

                        const aiResponse = (completion.data.choices[0].message.content).trim();
                        return res.status(200).json({result: aiResponse});

                    } catch(e) {
                        console.log(e.message);
                        return res.status(500).json({error: {message: e.message}});
                    }
                }
            }
                        
    } else {
        return res.status(500).json({error: {message: "Invalid API Route"}})
    }
}