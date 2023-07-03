
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

let db;

async function connectDb() {
  if (db) {
    return db;
  }
  
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {    
    await client.connect();
    console.log("Successfully connected to MongoDB");
    db = client.db(); // Assign the database instance to the global `db` variable
    return db;
  } catch (error) {
    console.error('Error occurred while connecting to MongoDB', error);
  }
}

async function createUser({ username, password, email }) {
  if (!username || !password || !email) {
    throw new Error('All fields are required');
  }

  const db = await connectDb();
  
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

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
  
  return null;
}

async function createIndexes() {
  const db = await connectDb();

  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
}

async function disconnectDb() {
  if (db) {
    await db.close();
    db = null;
  }
}

export { connectDb, disconnectDb, createUser, findUser, createIndexes };