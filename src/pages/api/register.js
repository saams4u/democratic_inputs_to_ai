
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, username } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db();

      const existingUser = await db.collection('users').findOne({ email });

      if (existingUser) {
        throw new Error('User exists already!');
      }

      const result = await db.collection('users').insertOne({
        email,
        password: hashedPassword,
        username,
      });

      if (!result || !result.insertedId) {
        throw new Error('Failed to register user');
      }

      res.status(200).json({
        _id: result.insertedId.toString(),
        email,
        username,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
}