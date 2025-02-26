"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./components/navbar";
import "./globals.css";

function AuthGuard({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log("Session status:", status); // Debugging
        if (status === "unauthenticated") {
            router.replace("/auth/login"); // Prevents back button loop
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
        <SessionProvider>
            <html>
                <body>
                    <AuthGuard>{children}</AuthGuard>
                    
                </body>
            </html>
        </SessionProvider>
    );
}