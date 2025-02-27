"use client";

import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user?.email) {
                try {
                    const response = await axios.get(`/api/user/profile?email=${session.user.email}`);
                    if (response.data.success) {
                        setUserData(response.data.user);
                    } else {
                        console.error("Failed to fetch user data.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [session]);

    if (status === "loading" || loading) {
        return <p className="text-center text-gray-500">Loading profile...</p>;
    }

    if (!session || !userData) {
        return <p className="text-center text-red-500">You are not logged in. Please log in to view your profile.</p>;
    }

    const { name, email, role, rollNumber, batch, courseCodes, createdAt, updatedAt } = userData;

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border border-gray-200 text-gray-800">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold">Profile</h1>
                <p className="text-gray-500 text-sm">Your personal details</p>
            </div>

            <div className="space-y-4 text-lg">
                <div><span className="font-semibold">Name:</span> {name || "N/A"}</div>
                <div><span className="font-semibold">Email:</span> {email || "N/A"}</div>
                <div><span className="font-semibold">Role:</span> {role || "N/A"}</div>
                {role === "student" && <div><span className="font-semibold">Roll Number:</span> {rollNumber || "N/A"}</div>}
                {batch && <div><span className="font-semibold">Batch:</span> {batch}</div>}
                {courseCodes?.length > 0 && (
                    <div><span className="font-semibold">Courses:</span> {courseCodes.join(", ")}</div>
                )}
                <div><span className="font-semibold">Created At:</span> {new Date(createdAt).toLocaleString()}</div>
                <div><span className="font-semibold">Updated At:</span> {new Date(updatedAt).toLocaleString()}</div>
            </div>

            <button
                className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                onClick={() => signOut()}
            >
                Sign Out
            </button>
        </div>
    );
}
