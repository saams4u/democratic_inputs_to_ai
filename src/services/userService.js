
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

async function connectDb() {
  const uri = process.env.MONGODB_URL;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db();
}

export async function registerUser({ email, password, username }) {
  const hashedPassword = await bcrypt.hash(password, 12)
  const db = await connectDb();
  
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

  const user = await db.collection('users').findOne({ _id: new ObjectId(result.insertedId) });

  if (!user) {
    throw new Error('Failed to register user');
  }

  return { 
      _id: user._id, 
      email: user.email, 
      username: user.username, 
  }
}