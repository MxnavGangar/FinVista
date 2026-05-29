import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

type AuthUser = {
  _id: {
    toString(): string;
  };
  name: string;
  email: string;
  password: string;
  role?: "customer" | "admin";
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        console.log("LOGIN ATTEMPT:", email);
        if (!email || !password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email })
          .select("+password")
          .lean<AuthUser>();
        console.log("FOUND USER:", user);
        if (!user || !user.password) {
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }
        console.log("PASSWORD MATCH:", passwordsMatch);
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
