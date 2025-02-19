'use client'
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session ? (
        <>
          <p>Welcome, {session.user?.name}!</p>
          <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
            Sign Out
          </button>
        </>
      ) : (
        <button onClick={() => signIn("google")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Sign In with Google
        </button>
      )}
    </div>
  );
}
