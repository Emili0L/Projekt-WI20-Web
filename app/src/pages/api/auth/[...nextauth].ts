import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [],
  theme: {
    colorScheme: "light",
    brandColor: "#D04A02",
    // logo: '/images/logo.png',
  },
};

export default NextAuth(authOptions);
