
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsKey from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

// Vercel Edge Function Configuration
export const config = {
    runtime: "edge",
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const configAuth = {
    providers: [
        CredentialsKey({
            name: "Supabase",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { email, password } = credentials

                // 1. Verify credentials with Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error || !data.user) return null

                // 2. Return user object for Auth.js session
                // We map Supabase user to Auth.js user structure
                return {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.name || email.split('@')[0],
                    image: data.user.user_metadata?.image,
                    role: data.user.user_metadata?.role || 'guest'
                }
            },
        }),
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }),
    callbacks: {
        async session({ session, user, token }) {
            // If using JWT strategy (default for Credentials), user comes from token
            if (session.user) {
                if (token?.sub) session.user.id = token.sub
                if (token?.role) session.user.role = token.role
                // If using Database strategy (Adapter), user object is populated
                if (user) {
                    session.user.id = user.id
                    // Auth.js default User model doesn't have role, so we might need to fetch it or Extend it.
                    // But since we use Credentials provider, it defaults to JWT strategy unless configured otherwise.
                    // Supabase Adapter works with Database strategy.
                    // Credentials provider FORCES JWT strategy.
                    // So we need to ensure we pass role to token.
                }
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        }
    },
    session: {
        strategy: "jwt" // Required for Credentials provider
    },
    trustHost: true,
}

export const { GET, POST, auth } = NextAuth(configAuth)
