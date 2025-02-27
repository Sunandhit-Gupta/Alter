// app/components/ClientProvider.js
"use client";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import here or in layout.js
import AuthGuard from "./AuthGuard";

export default function ClientProvider({ children }) {
  return (
    <SessionProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}