
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsKey from "next-auth/providers/credentials"

// Vercel Edge Function Configuration
export const config = {
    runtime: "edge",
}

const configAuth = {
    providers: [
        CredentialsKey({
            name: "Supabase",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Placeholder for credential logic. 
                // In a real Supabase setup, you'd verify against the 'auth.users' table 
                // or use the Supabase Client to signIn and return the user.
                return null
            },
        }),
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }),
    callbacks: {
        async session({ session, user }) {
            if (user) session.user.id = user.id
            return session
        },
    },
    trustHost: true,
}

export const { GET, POST, auth } = NextAuth(configAuth)
