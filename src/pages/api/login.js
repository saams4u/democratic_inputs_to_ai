
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { withIronSession } from "next-iron-session";

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  if (!client.isConnected()) await client.connect();

  return { db: client.db(), client };
}

async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const { db, client } = await connectToDatabase();

    try {
      const user = await db.collection('users').findOne({ username });

      if (!user) {
        res.status(404).json({ error: 'User does not exist!' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Incorrect password!' });
        return;
      }

      const userForSession = {
        id: user._id.toString(),
        username: user.username,
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
};

export default withIronSession(handler, {
  cookieName: 'user-session',
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});