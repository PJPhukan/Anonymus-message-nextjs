import NextAuth from "next-auth";
import { authOptions } from "./options";

//name should handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }