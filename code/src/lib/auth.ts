import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});

/**
 * Get a valid access token for Google, refreshing if expired.
 */
export async function getValidAccessToken(
  userId: string,
  provider: "google" = "google"
): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider },
  });

  if (!account?.access_token) return null;

  // Check if token is still valid (with 5 min buffer)
  const expiresAt = account.expires_at ? account.expires_at * 1000 : 0;
  if (Date.now() < expiresAt - 5 * 60 * 1000) {
    return account.access_token;
  }

  // Token expired, refresh it
  if (!account.refresh_token) return null;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      }),
    });
    const tokenResponse = await res.json();

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: tokenResponse.access_token,
        expires_at: Math.floor(Date.now() / 1000 + tokenResponse.expires_in),
      },
    });

    return tokenResponse.access_token;
  } catch (error) {
    console.error("Failed to refresh Google token:", error);
    return null;
  }
}

export async function getLinkedAccounts(userId: string) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true, providerAccountId: true },
  });
  return accounts;
}
