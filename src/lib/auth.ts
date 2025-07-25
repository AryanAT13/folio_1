import { db } from "@/lib/db";
import { getServerSession, type AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email || !profile) {
        return false;
      }
      try {
        const userInDbResult = await db.execute({
          sql: "SELECT id FROM user WHERE email = ?",
          args: [user.email],
        });

        if (userInDbResult.rows.length === 0) {
          const githubProfile = profile as any;
          const newUserId = "user_" + crypto.randomUUID();
          await db.execute({
            sql: "INSERT INTO user (id, github_id, username, name, email) VALUES (?, ?, ?, ?, ?)",
            args: [
              newUserId,
              githubProfile.id,
              githubProfile.login,
              githubProfile.name,
              user.email,
            ],
          });
          user.id = newUserId;
        } else {
          user.id = userInDbResult.rows[0].id as string;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);