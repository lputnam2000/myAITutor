import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb";
import {ObjectId} from 'mongodb';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      try {
        const client = await clientPromise;
        let users = client.db("admin").collection("users");
        let uid = user.user.id
        let isRegistered = await users.findOne({
          "_id": ObjectId(uid),
          "Initialized": { $exists: true }
        });
        //check if the user is not registered
        if (isRegistered == null) {
          users.updateOne(
            { "_id": ObjectId(uid) }, 
            { $set: { "Initialized": true } }
          )          
          // do something if the user is new
          console.log("NEW USER: ", uid)
          let userUploads = client.db("data").collection("UserUploads");
          const result = await userUploads.updateOne(
            { userid: user.user.id },
            {
              $push: {
                uploads:
                {
                  "uuid": "48a26389-ff79-4f66-a318-56d516544dcf",
                  "title": "The Evolution of Apes :)",
                  "status": "Not Ready",
                  "type": "youtube",
                  "url": "https://www.youtube.com/watch?v=5G13oKqCFs4"
                }
              },
            },
            { upsert: true }
          );
        } else {
          console.log("OLD USER: ", user.user.id)
        }
      } catch (e) {
        console.log("Error", e)
      }
      return true;



    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin"
  }
};

export default (req, res) => NextAuth(req, res, authOptions)
