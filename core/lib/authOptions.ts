import prisma from "@/db";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    github_id?: number;
  }

  interface Session {
    accessToken?: string;
  }
}

const GITHUB_ID = process.env.GITHUB_ID!;
const GITHUB_SECRET = process.env.GITHUB_SECRET!;
const STATIC_LOGIN_PASSWORD = process.env.STATIC_LOGIN_PASSWORD!;
const STATIC_GITHUB_ACCESS_TOKEN = process.env.STATIC_GITHUB_ACCESS_TOKEN!;

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: "repo read:user user:email",
          prompt: "consent",
        },
      },
    }),

    CredentialsProvider({
      name: "Password Login",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.password &&
          credentials.password === STATIC_LOGIN_PASSWORD
        ) {
          // Fake user for static password login
          return {
            id: "cmcxfazcu0000i604lrzycolo",
            name: "Abhi",
            email: "abhishekbr989@gmail.com",
            github_id: 194474899,
            github_username:"Abhishek394624",
            image: "https://avatars.githubusercontent.com/u/194474899?v=4",
            accessToken: STATIC_GITHUB_ACCESS_TOKEN,
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // For OAuth GitHub login
      if (account) {
        token.accessToken = account.access_token;
      }

      // For credentials login
      if (user && "accessToken" in user) {
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },

    async signIn({ user, account, profile }) {
      // Credentials login: bypass DB
      if (account?.provider === "credentials") {
        return true;
      }

      if (!profile || !account) return false;

      const githubProfile = profile as {
        name?: string;
        email?: string;
        avatar_url?: string;
        bio?: string;
        login?: string;
        id?: number;
      };

      const github_id = githubProfile.id;

      const db_data = {
        github_id,
        name: githubProfile.name ?? user.name ?? githubProfile.login ?? "",
        email: user.email ?? "",
        avatar_url: githubProfile.avatar_url,
        bio: githubProfile.bio,
        access_token: account.access_token ?? "",
        username: githubProfile.login ?? "",
      };

      if (
        !db_data.name ||
        !db_data.email ||
        !db_data.access_token ||
        !db_data.username
      ) {
        return false;
      }

      const upsertedUser = await prisma.user.upsert({
        where: { github_id: db_data.github_id },
        create: {
          github_id: db_data.github_id || 0,
          accessToken: db_data.access_token,
          avatar: db_data.avatar_url ?? "",
          bio: db_data.bio ?? "",
          email: db_data.email,
          name: db_data.name,
          github_username: db_data.username,
        },
        update: {
          accessToken: db_data.access_token,
          avatar: db_data.avatar_url,
          bio: db_data.bio,
          email: db_data.email,
          name: db_data.name,
          github_username: db_data.username,
        },
      });

      user.id = upsertedUser.id;
      user.github_id = upsertedUser.github_id!;

      return true;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
