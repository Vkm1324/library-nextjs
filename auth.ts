import { IUser } from "@/lib/user-management/models/user.model";
import { UserRepository } from "@/lib/user-management/user.repository";
import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/db";
const userRepo = new UserRepository();

async function getUser(user: IUser): Promise<{ id: number; role: number }> {
  try {
    const result = await userRepo.getByMail(user.email);
    if (result) {
      return { id: result.id, role: result.role };
    } else {
      const newUser = await userRepo.create(user);
      return { id: newUser.id, role: newUser.role };
    }
  } catch (error) {
    console.error("Failed to fetch or create user:", error);
    throw new Error("Failed to fetch or create user.");
  }
}

// Extend session and user types
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: number;
    } & DefaultSession["user"];
  }

  interface user {
    id: number;
    role: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // This condition will be true only on initial sign-in
        const { id, role } = await getUser(user as unknown as IUser);
        token.id = id;
        token.role = role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as number;
        session.user.id = token.id as number;
      }
      return session;
    },
  },
});
