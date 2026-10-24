import { db } from "@/lib/db";
import { getServerSession, type AuthOptions } from "next-auth";
import GitHubProvider, { type GithubProfile } from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID?.trim() ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET?.trim() ?? "",
      issuer: "https://github.com/login/oauth",
      httpOptions: { timeout: 10000 },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET?.trim(),
  session: {
    strategy: "jwt",
  },
  // Send auth errors back to the guestbook (which explains them) instead of NextAuth's
  // generic "Try signing in with a different account" page.
  pages: {
    signIn: "/guestbook",
    error: "/guestbook",
  },
  callbacks: {
    async signIn({ user, profile }) {
      const githubProfile = profile as GithubProfile | undefined;
      if (!user.email || !githubProfile) {
        console.error("[auth] GitHub sign-in rejected: no email or profile returned.");
        return false;
      }
      try {
        // Match on the GitHub account id first so a changed email doesn't hit the
        // UNIQUE(github_id) constraint; fall back to email for rows created before.
        const userInDbResult = await db.execute({
          sql: "SELECT id FROM user WHERE github_id = ? OR email = ? ORDER BY github_id = ? DESC LIMIT 1",
          args: [githubProfile.id, user.email, githubProfile.id],
        });

        if (userInDbResult.rows.length === 0) {
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
        console.error("[auth] Database error in signIn callback:", error);
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
