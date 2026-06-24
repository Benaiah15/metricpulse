import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, 
  trustHost: true,
  // We use the environment variable, but keep your string as a fallback just in case!
  secret: process.env.AUTH_SECRET || "2tRYgv1NfLMW7cAU63gDBFmwsLtu/kKcdRD5s3rEXy8=", 
  session: { 
    strategy: "jwt" 
  }, 
  providers: [
    Credentials({
      name: "Admin Portal",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Ensure the user actually typed something
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 2. Check the username (defaults to 'admin' if the env variable isn't set)
        const expectedUsername = process.env.ADMIN_USERNAME || "admin";
        const isCorrectUsername = credentials.username === expectedUsername;
        
        // 3. The Enterprise Security Upgrade: Compare the hashed password
        const expectedHash = process.env.ADMIN_PASSWORD_HASH || "";
        const isCorrectPassword = await compare(credentials.password as string, expectedHash);

        // 4. If both match, let them in!
        if (isCorrectUsername && isCorrectPassword) {
          return { id: "1", name: "System Admin", email: "admin@metricpulse.local" };
        }
        
        // Return null if login fails
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
      
      if (isApiAuthRoute) {
        return true; 
      }

      return isLoggedIn;
    },
  },
});