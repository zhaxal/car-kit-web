import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "../../../firebase/models/User";
import { setUser } from "../../../firestore/auth-functions";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const [result, err] = await setUser(user as User);

      if (err) {
        throw err;
      }

      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});
