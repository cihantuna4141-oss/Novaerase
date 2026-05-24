import NextAuth, { NextAuthOptions } from "next-auth";
import { authOptions } from "./Options";

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
