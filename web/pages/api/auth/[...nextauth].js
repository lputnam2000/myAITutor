import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

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
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, isNewUser }) {
      if (isNewUser) {
        console.log("JWT - IS NEW USER?: ", isNewUser)
        console.log("JWT - userid", token.sub)
        let user_id = token.sub
        try {
          const client = await clientPromise;
          let userUploads = client.db("data").collection("UserUploads");
          const result = await userUploads.updateOne(
            { userid: user_id },
            {
              $push: {
                uploads:
                {
                  "uuid": "582fc8e4-c611-448f-b8da-19fc743d4039",
                  "title": "bitcoin.pdf",
                  "progress": 100,
                  "type": "pdf"
                }
              },
            },
            { upsert: true }
          );
        } catch (e) {
          console.log("Error in JWT callback: ", e)
        }
      };
      return token;
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
