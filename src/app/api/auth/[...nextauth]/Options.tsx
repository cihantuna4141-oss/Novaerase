import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        // 1. Locate Admin in Database
        const admin = await prisma.admin.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phoneNumber: credentials.identifier },
            ],
          },
        });

        if (!admin) throw new Error("No admin account localized");

        // 2. STEP 2 BYPASS: Logic for the Verification (2FA) Page
        // This is triggered after verify-code API succeeds
        if (credentials.password === "VERIFIED_VIA_CODE") {
          return {
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            passwordChanged: admin.passwordChanged,
          };
        }

        // 3. STEP 1: Standard Password Check
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!isPasswordCorrect) throw new Error("Invalid command key");

        // Return user object for JWT callback
        return {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          passwordChanged: admin.passwordChanged,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Transfer data from the 'authorize' return object to the token
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.passwordChanged = user.passwordChanged;
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer data from the token to the session (client-side)
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.passwordChanged = token.passwordChanged;
        
        // Populate standard 'name' for backward compatibility
        session.user.name = `${token.firstName} ${token.lastName}`;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin-dashboard/signin",
    error: "/admin-dashboard/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

