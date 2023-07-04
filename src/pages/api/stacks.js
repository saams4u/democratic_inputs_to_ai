
import { cors, runMiddleware } from "./middleware";
import { withNextSession } from "@/lib/session";

import fs from 'fs';
import path from 'path';

export default withNextSession(async (req, res) => {
    await runMiddleware(req, res, cors);

    if (req.method === "GET") {
        const filePath = path.join(process.cwd(), 'public/data/stacks.json');

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            res.status(200).json(JSON.parse(fileContent));
        } catch (error) {
            console.error('Error reading file:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.setHeader('Allow', 'GET')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
})