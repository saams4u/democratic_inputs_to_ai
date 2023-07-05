
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { MongoClient } from 'mongodb';
import { registerUser } from '@/services/userService';

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
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
        const uri = process.env.MONGODB_URI;
        const client = new MongoClient(uri);
        
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
                return { error: "Registration failed" }
              }
            } catch (e) {
              return { error: e.message }
            }
          } else {
            const user = await users.findOne({ username: credentials.username });
            if (user && (await bcrypt.compare(credentials.password, user.password))) {
              return { id: user._id, name: user.username, email: user.email }
            } else {
              return { error: "Invalid username or password" };
            }
          }
        } catch(e) {
            console.error("Failed to connect to MongoDB", e);
            return { error: "Server error: failed to connect to database." };
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
    async jwt(token, user) {
      if (user) {
        token.id = user.id; // Save user ID into token
        token.email = user.email; // Save user email into token
      }
      return Promise.resolve(token);
    },
    async session(session, token) {
      session.user.id = token.id; // Add user ID to session
      session.user.email = token.email; // Add user email to session
      return Promise.resolve(session);
    },
    async signIn(user, account, profile) {
      if (account && account.type === 'credentials') {
        if (!user) {
          console.log("Authentication failed.");
          return Promise.reject('/login'); // Redirecting to login page
        }
      }
      return true;
    }     
  },  
  events: {
    async signIn(message) {
      if (message.error) {
        message.res.setHeader('Access-Control-Allow-Credentials', 'true');
        message.res.setHeader('Access-Control-Allow-Origin', 'https://democratic-inputs-to-ai-3bv6.vercel.app');
      }
    },
    async session(message) {
      if (message.error) {
        message.res.setHeader('Access-Control-Allow-Credentials', 'true');
        message.res.setHeader('Access-Control-Allow-Origin', 'https://democratic-inputs-to-ai-3bv6.vercel.app');
      }
    }
  }
})