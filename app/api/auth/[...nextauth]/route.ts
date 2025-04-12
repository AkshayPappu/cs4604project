import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    student_id?: string;
    officer_id?: string;
    organizer_id?: string;
    admin_id?: string;
  }

  interface Session {
    user: User & {
      id: string;
      email?: string | null;
    };
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Get user from Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("User not found");
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object that will be saved in the session
        return {
          id: user.id,
          email: user.email,
          student_id: user.student_id,
          officer_id: user.officer_id,
          organizer_id: user.organizer_id,
          admin_id: user.admin_id
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.student_id = user.student_id;
        token.officer_id = user.officer_id;
        token.organizer_id = user.organizer_id;
        token.admin_id = user.admin_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.student_id = token.student_id as string | undefined;
        session.user.officer_id = token.officer_id as string | undefined;
        session.user.organizer_id = token.organizer_id as string | undefined;
        session.user.admin_id = token.admin_id as string | undefined;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }; 