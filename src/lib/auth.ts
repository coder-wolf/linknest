import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { emailSchema } from "@/lib/validation";

// Used for unknown emails so login timing doesn't reveal whether an account
// exists. Never matches a real password.
const DUMMY_HASH = "$2b$12$R8PDr.RwFIT2NjeVBnZ5dOneovud3oX28hNHiEV.EA7qnqP4MnqLm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = emailSchema.safeParse(credentials?.email);
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email.success || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.data },
          include: { profile: true },
        });
        if (!user) {
          await compare(password, DUMMY_HASH);
          return null;
        }

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.displayName ?? user.email.split("@")[0],
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.sessionVersion =
          (user as { sessionVersion?: number }).sessionVersion ?? 0;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      (session.user as { sessionVersion?: number }).sessionVersion =
        typeof token.sessionVersion === "number" ? token.sessionVersion : 0;
      return session;
    },
  },
});
