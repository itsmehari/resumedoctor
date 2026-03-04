// WBS 2.1, 2.6 – NextAuth configuration
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes } from "crypto";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/totp";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, image: true, passwordHash: true, twoFactorEnabled: true, twoFactorSecret: true, role: true },
        });
        if (!user?.passwordHash) return null;

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const token = randomBytes(32).toString("hex");
          const expires = new Date(Date.now() + 5 * 60 * 1000);
          await prisma.twoFactorToken.create({ data: { userId: user.id, token, expires } });
          throw new Error(`2FA_REQUIRED:${token}`);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: (user as { role?: string }).role,
        };
      },
    }),
    CredentialsProvider({
      id: "2fa",
      name: "2fa",
      credentials: {
        token: { label: "Token", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token || !credentials?.code) return null;

        const tf = await prisma.twoFactorToken.findUnique({
          where: { token: credentials.token },
          include: { user: { select: { id: true, email: true, name: true, image: true, twoFactorSecret: true, twoFactorBackupCodes: true, role: true } } },
        });
        if (!tf || tf.expires < new Date() || !tf.user) return null;

        const user = tf.user as { twoFactorSecret: string | null; twoFactorBackupCodes: string | null };
        let codeValid = false;
        if (user.twoFactorSecret) {
          codeValid = await verifyToken(user.twoFactorSecret, credentials.code.replace(/\s/g, ""));
        }
        if (!codeValid && user.twoFactorBackupCodes) {
          const codes: string[] = JSON.parse(user.twoFactorBackupCodes);
          codeValid = codes.includes(credentials.code);
        }
        if (!codeValid) return null;

        await prisma.twoFactorToken.deleteMany({ where: { token: credentials.token } });

        return {
          id: tf.user.id,
          email: tf.user.email,
          name: tf.user.name,
          image: tf.user.image,
          role: (tf.user as { role?: string }).role,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        const role = (user as { role?: string }).role;
        if (role) token.role = role;
        else {
          const db = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = db?.role ?? "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;
      if (!user.email) return false;
      return true;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existing && !existing.emailVerified) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { emailVerified: new Date() },
          });
        }
      }
    },
  },
};
