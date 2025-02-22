"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();
    const userRole = session?.user?.role; // Assuming role is stored in session

    const handleSignOut = () => {
        signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <div className="flex flex-row justify-center space-x-9 my-5">
            {userRole === "student" ? (
                <>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/student/history">History</Link>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/student/upcomingQuizes">Upcoming Quizzes</Link>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/student/ongoingQuizes">Ongoing Quizzes</Link>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/profile">Profile</Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/history">History</Link>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/createQuiz">Create Quiz</Link>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/pendingQuiz">Pending Quiz</Link>
                    </div>
                    <div className="cursor-pointer hover:bg-slate-400 transition duration-500 rounded-md p-2 hover:text-white">
                        <Link href="/pages/profile">Profile</Link>
                    </div>
                </>
            )}

            <button
                onClick={handleSignOut}
                className="cursor-pointer bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition duration-500"
            >
                Sign Out
            </button>
        </div>
    );
}
