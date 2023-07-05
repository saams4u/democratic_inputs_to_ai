
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { withNextSession } from '@/lib/session'; // Use your actual session middleware if different

export default withNextSession(async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db();

    try {
      const user = await db.collection('users').findOne({ username });

      if (!user) {
        throw new Error('User does not exist!');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Incorrect password!');
      }

      const userForSession = {
        id: user._id.toString(),
        username: username,
        email: user.email,
      }

      req.session.set('user', userForSession);
      await req.session.save();

      res.status(200).json(userForSession);
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      await client.close();
    }

  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
});