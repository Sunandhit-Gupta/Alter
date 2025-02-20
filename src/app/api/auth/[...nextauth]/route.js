import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });

                const user = await res.json();

                if (res.ok && user?.id) {
                    return {
                        id: user.id,          // Ensure ID is passed to token
                        email: user.email,
                        role: user.role,
                        token: user.token,    // Pass token as well
                    };
                }

                console.error("User ID not found in login response.");
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;  // Pass user ID to token
                token.role = user.role;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;  // Ensure session has user ID
                session.user.role = token.role;
                session.user.token = token.accessToken;
            } else {
                console.error("User ID not found in session.");
            }
            return session;
        },
    },

    secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
