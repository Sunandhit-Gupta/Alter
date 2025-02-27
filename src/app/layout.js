"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    // Skeleton Component for Navbar and Content
    const SkeletonLayout = () => (
        <div className="min-h-screen flex flex-col">
            {/* Skeleton Navbar */}
            <div className="bg-gray-200 p-4 shadow-md animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-32 bg-gray-300 rounded"></div>
                    <div className="flex space-x-4">
                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
            {/* Skeleton Main Content */}
            <main className="flex-grow container mx-auto p-4">
                <div className="h-8 w-1/3 bg-gray-300 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
                        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
                        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    </div>
                    <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
                        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </main>
        </div>
    );

    if (status === "loading") {
        return <SkeletonLayout />;
    }

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
                <ToastContainer position="top-right" autoClose={3000} />
                    <AuthGuard>{children}</AuthGuard>
                </body>
            </html>
        </SessionProvider>
    );
}
