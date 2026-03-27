/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { loginSchema } from "./schemas";
import { verifyPassword } from "./password";
import { findUserByEmail, findUserById, createUser } from "./queries/users";
import { findAccount, createAccount } from "./queries/accounts";
import {
  createSession,
  deleteSessionBySessionId,
} from "./queries/sessions";
import { generateSessionId, generateToken } from "./utils";

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) return null;

        const user = findUserByEmail(parsed.data.email);
        if (!user || !user.password_hash) return null;

        const ok = await verifyPassword(
          parsed.data.password,
          user.password_hash,
        );
        if (!ok) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        const providerAccountId = account.providerAccountId as string;

        const existingAccount = findAccount("google", providerAccountId);

        if (existingAccount) {
          const dbUser = findUserById(existingAccount.user_id);
          if (!dbUser) return false;

          user.id = String(dbUser.id);
          user.name = dbUser.name;
          user.email = dbUser.email;
          user.image = dbUser.image;
          return true;
        }

        let dbUser = user.email ? findUserByEmail(user.email) : undefined;

        if (!dbUser) {
          dbUser = createUser({
            name: user.name || "Google User",
            email: user.email!,
            image: user.image ?? null,
            passwordHash: null,
          });
        }

        if (!dbUser) return false;

        createAccount({
          userId: dbUser.id,
          provider: "google",
          providerAccountId,
        });

        user.id = String(dbUser.id);
        return true;
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.id;

        if (!token.sessionId) {
          const sessionId = generateSessionId();
          const sessionToken = generateToken();
          const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString();

          createSession({
            sessionId,
            userId: Number(user.id),
            token: sessionToken,
            expiresAt,
          });

          token.sessionId = sessionId;
          token.sessionToken = sessionToken;
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
        session.sessionId = token.sessionId;
      }

      return session;
    },
  },

  events: {
    async signOut(message: any) {
      const sessionId = message?.token?.sessionId;
      if (sessionId) {
        deleteSessionBySessionId(sessionId);
      }
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
