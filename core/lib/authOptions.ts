import prisma from "@/db";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface User {
    github_id?: number;
  }
  
  interface Session {
    accessToken?: string;
  }
}

const GITHUB_ID = process.env.GITHUB_ID! ;
const GITHUB_SECRET = process.env.GITHUB_SECRET! ;

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
  ],
  callbacks: {

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    
    async signIn({ user, account, profile }) {
        if (!profile || !account) return false;
        console.log("Access token:", account.access_token);

        const githubProfile = profile as {
            name?: string;
            email?: string;
            avatar_url?: string;
            bio?: string;
            login?: string;
            id ?: number
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

  secret: process.env.NEXT_AUTH_SECRET,
};
