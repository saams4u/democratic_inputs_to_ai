
import { getSession } from 'next-auth/react';

export default async (req, res) => {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        // Here you would stop the chatbot from generating more responses
        // You might use some sort of session or chatbot management service to achieve this
        res.status(200).json({ success: 'Chatbot has been stopped' });
    } else {
        res.status(405).json({ error: 'Invalid HTTP method' });
    }
}
