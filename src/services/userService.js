
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client;
}

export async function registerUser({ email, password, username }) {
  const hashedPassword = await bcrypt.hash(password, 12)
  const client = await connectDb();
  const db = client.db();

  try {
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      throw new Error('User exists already!')
    }
    
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      username
    })

    if (!result || !result.insertedId) {
      throw new Error('Failed to register user');
    }

    return { 
        _id: result.insertedId.toString(), 
        email, 
        username
    }
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}