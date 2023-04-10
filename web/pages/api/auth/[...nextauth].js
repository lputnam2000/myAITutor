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
        let accounts = client.db("admin").collection("accounts");

        //if the user is new, then the user.user.id is actually the provider id, lets check:
        let user_id = null;
        let userObject = null;
        try {
          user_id = new ObjectId(user.user.id.toString());
          userObject = await users.findOne({_id: user_id})
        } catch (e) {
          console.log("user.user.id was not valid for creating ObjectId: ", user.user.id)
          console.log("Searching for real userid by using accounts collection with user.id.id as provider id")
          let providerAccountId = user.user.id
          const lastAccount = await accounts.findOne({ providerAccountId }, { sort: { $natural: -1 } });
          console.log("LastAccount: ", lastAccount);
          const user_id = lastAccount.userId;
        }

        console.log("UserObject: ", userObject)
        if (!userObject) {
          //this user is new
          let userUploads = client.db("data").collection("UserUploads");
          const result = await userUploads.updateOne(
            { userid: user_id },
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
          //this user already existed, because user.user.id is an actual userid
          return true
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
