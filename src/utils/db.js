
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

let client;

async function connectDb() {
  if (client && client.isConnected()) {
    return client.db();
  }
  
  const uri = process.env.MONGODB_URI;
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {    
    await client.connect();
    console.log("Successfully connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error('Error occurred while connecting to MongoDB', error);
    client = null; // Reset client on error
  }
}

async function createUser({ username, password, email }) {
  if (!username || !password || !email) {
    throw new Error('All fields are required');
  }

  const db = await connectDb();  
  const salt = await bcrypt.genSalt(12);

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error occurred while hashing password', error);
    throw new Error('Failed to create user');
  }

  try {
    const result = await db.collection('users').insertOne({
      username,
      password: hashedPassword,
      email,
    });
    return { id: result.insertedId, username, email };
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Username or email already taken');
    }
    throw error;
  }
}

async function findUser(filter) {
  const db = await connectDb();
  const user = await db.collection('users').findOne(filter);

  if (user) {
    return { id: user._id, username: user.username, email: user.email };
  }
  
  return {};  
}

async function createIndexes() {
  const db = await connectDb();
  try {
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  } catch (error) {
    console.error('Error occurred while creating indexes', error);
  }
}

async function disconnectDb() {
  if (client) {
    await client.close();
    client = null;
  }
}

export { connectDb, disconnectDb, createUser, findUser, createIndexes };