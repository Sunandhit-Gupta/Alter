"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./components/navbar";
import "./globals.css";

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Render content only if authenticated
  if (status === "authenticated") {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </>
    );
  }

  // Return null if unauthenticated (redirect handled by useEffect)
  return null;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QuizMate</title>
      </head>
      <body className="flex flex-col min-h-full bg-gray-100">
        <SessionProvider>
          <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
        <footer className="mt-auto p-4 text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-inner">
          © {new Date().getFullYear()} QuizMate. All rights reserved.
        </footer>
      </body>
    </html>
  );
}