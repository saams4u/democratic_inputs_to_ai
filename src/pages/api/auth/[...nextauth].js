
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { MongoClient } from 'mongodb';
import { registerUser } from '@/services/userService';

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: {  label: "Password", type: "password" },
        email: { label: "Email", type: "text" },
        isRegistration: { label: "Is Registration", type: "hidden" }
      },
      async authorize(credentials) {
        const uri = process.env.MONGODB_URL;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        
        try {
          await client.connect();
          const db = client.db();
          const users = db.collection('users');

          if(credentials.isRegistration === 'true') {
            try {
              const user = await registerUser(credentials);
              if (user) {
                return { id: user._id, name: user.username, email: user.email }
              } else {
                throw new Error("Registration failed")
              }
            } catch (e) {
              throw new Error(e.message)
            }
          } else {
            const user = await users.findOne({ username: credentials.username });
            if (user && (await bcrypt.compare(credentials.password, user.password))) {
              return { id: user._id, name: user.username, email: user.email }
            } else {
              return null;
            }
          }
        } finally {
          await client.close();
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user, account) {
      if (user) token.id = user.id; // Save user ID into token
      if (account?.error) token.error = account.error; // Save error into token
      return token;
    },
    async session(session, token) {
      session.error = token?.error; // Add error to session
      session.id = token?.id; // Add user ID to session
      return session;
    },
    async signIn(user, account, profile) {
      console.log(user);
      if (account && account.type === 'credentials') { // Check if account exists before accessing its properties
        if (profile.error || !user) {
          console.log("Authentication failed.");
          return Promise.reject(new Error('Authentication failed'));
        }
      }
      return true;
    }    
  }  
})