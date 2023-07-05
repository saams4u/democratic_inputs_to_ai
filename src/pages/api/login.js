
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { withIronSession } from "next-iron-session"; // Assuming you are using next-iron-session

async function handler(req, res) {
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
};

export default withIronSession(handler, {
  cookieName: 'user-session', // replace with your cookie name
  password: process.env.SECRET_COOKIE_PASSWORD, // replace with your secret password
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});