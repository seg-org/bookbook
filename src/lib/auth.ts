import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phoneNumber?: string | null;
  isAdmin: boolean;
  isSeller: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  pdpaConsent: boolean;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Wrong username or password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Wrong username or password");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          name: `${user.firstName} ${user.lastName}`,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          emailVerified: user.emailVerified !== null,
          phoneVerified: user.phoneVerified !== null,
          pdpaConsent: user.pdpaConsent,
        };
      },
    }),
  ],
  // In your authOptions.ts
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phoneNumber = token.phoneNumber;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isSeller = token.isSeller as boolean;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.phoneVerified = token.phoneVerified as boolean;
        session.user.pdpaConsent = token.pdpaConsent as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = `${dbUser.firstName} ${dbUser.lastName}`;
          token.email = dbUser.email;
          token.phoneNumber = dbUser.phoneNumber;
          token.isAdmin = dbUser.isAdmin;
          token.isSeller = dbUser.isSeller;
          token.emailVerified = dbUser.emailVerified !== null;
          token.phoneVerified = dbUser.phoneVerified !== null;
          token.pdpaConsent = dbUser.pdpaConsent;
        }
      }
      return token;
    },
  },
};
