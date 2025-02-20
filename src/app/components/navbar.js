"use client";
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
    const handleSignOut = () => {
        signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <div className='flex flex-row justify-center space-x-9 my-5'>
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
            <button
                onClick={handleSignOut}
                className="cursor-pointer bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition duration-500"
            >
                Sign Out
            </button>
        </div>
    );
}
