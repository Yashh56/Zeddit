import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await db.user.findUnique({
            where: {
              email:credentials.email
            },
          });
          if (!user) {
            throw new Error("No user found with email");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token,user}){
      if(user){
        token.id = user.id;
        token.username = user.username
      }
      return token;
    },
    async session({session,token}){
      if(token){
        session.user.id = token.id;
        session.user.username = token.username
        session.user.name = token.username
      }
      return session
    }
  },
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXT_PUBLIC_SECRET,
  pages:{
    signIn:'sign-in'
  }
};
