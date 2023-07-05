
import { connectDb } from "@/lib/db";

export default async function userRoute(req, res) {
  if (req.method === 'GET') {
    const { username } = req.cookies;

    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }

    const client = await connectDb();
    const db = client.db();

    try {
      const user = await db.collection('users').findOne({ username });

      if (user) {
        const { password, ...userData } = user;
        return res.status(200).json(userData);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } finally {
      client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}