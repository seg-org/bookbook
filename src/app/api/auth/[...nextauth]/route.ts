import NextAuth from "next-auth";
import { authOptions } from "./auth";

const handler = NextAuth(authOptions);
export { authOptions, handler as GET, handler as POST };
