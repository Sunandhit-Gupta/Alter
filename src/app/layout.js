"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./components/navbar";
import './globals.css';

function AuthGuard({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <>
            {session && <Navbar role={session.user.role} />}
            <main>{children}</main>
        </>
    );
}

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <SessionProvider>
                    <AuthGuard>{children}</AuthGuard>
                </SessionProvider>
            </body>
        </html>
    );
}
