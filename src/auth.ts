import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, 
  trustHost: true,
  secret: "2tRYgv1NfLMW7cAU63gDBFmwsLtu/kKcdRD5s3rEXy8=", 
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
        if (credentials?.username === "admin" && credentials?.password === "secure_password_123") {
          return { id: "1", name: "System Admin", email: "admin@metricpulse.local" };
        }
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