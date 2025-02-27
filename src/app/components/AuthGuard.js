// app/components/AuthGuard.js
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./navbar"; // Adjust path if needed
import SkeletonLayout from "./SkeletonLayout"; // Import skeleton component

export default function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session status:", status); // Debugging
    if (status === "unauthenticated") {
      router.replace("/auth/login"); // Prevents back button loop
    }
  }, [status, router]);

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