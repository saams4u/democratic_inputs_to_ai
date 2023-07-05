
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectDb() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    cachedClient = client;
  } catch (err) {
    throw new Error('Failed to connect to the database');
  }

  return client;
}

export async function registerUser({ email, password, username }) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const client = await connectDb();
  const db = client.db();

  try {
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

    return {
      _id: result.insertedId.toString(),
      email,
      username,
    };
  } catch (error) {
    throw error;
  }
}

export async function loginUser({ username, password }) {
  const client = await connectDb();
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

    return {
      id: user._id.toString(),
      username,
      email: user.email,
    };
  } catch (error) {
    throw error;
  }
}