// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "./database";
import { Subscription } from "@/models/Subscription";
import type { DefaultSession, DefaultUser } from "next-auth";
import prisma from "./prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      companyId?: string;
      hasActiveSubscription: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    companyId?: string;
    hasActiveSubscription: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId?: string;
    hasActiveSubscription: boolean;
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findFirst({
          where: { 
            email: { 
              equals: credentials.email, 
              mode: "insensitive" 
            } 
          },
        });


        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log('Password mismatch');
          throw new Error("Invalid credentials");
        }


   
        // Admin users bypass subscription checks
        if (user.role === 'admin') {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId ? user.companyId.toString() : undefined,
            hasActiveSubscription: true // Always true for admins
          };
        }

        // Check for active subscription for non-admin users
        const activeSub = await Subscription.findOne({
          user: user.id,
          status: 'Active',
          expiresAt: { $gt: new Date() }
        });

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId ? user.companyId.toString() : undefined,
          hasActiveSubscription: !!activeSub
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string | undefined;
        session.user.hasActiveSubscription = token.hasActiveSubscription as boolean;
      }
      return session;
    },
  
    async jwt({ token, user,trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.companyId = user.companyId;
        token.hasActiveSubscription = user.hasActiveSubscription;
      }


    // Update from client-side session updates
    if (trigger === "update" && session?.user?.hasActiveSubscription !== undefined) {
      token.hasActiveSubscription = session.user.hasActiveSubscription;
    }

      return token;
    }
  }
  
};