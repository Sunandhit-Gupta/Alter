"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

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
        return <p>Loading profile...</p>;
    }

    if (!session || !userData) {
        return <p>You are not logged in. Please log in to view your profile.</p>;
    }

    const { name, email, role, rollNumber, batch, courseCodes, createdAt, updatedAt } = userData;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-3xl font-bold mb-5">Profile</h1>

            <div className="space-y-4">
                <div><strong>Name:</strong> {name || "N/A"}</div>
                <div><strong>Email:</strong> {email || "N/A"}</div>
                <div><strong>Role:</strong> {role || "N/A"}</div>
                {role === "student" && <div><strong>Roll Number:</strong> {rollNumber || "N/A"}</div>}
                {batch && <div><strong>Batch:</strong> {batch}</div>}
                {courseCodes?.length > 0 && (
                    <div><strong>Courses:</strong> {courseCodes.join(", ")}</div>
                )}
                <div><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</div>
                <div><strong>Updated At:</strong> {new Date(updatedAt).toLocaleString()}</div>
            </div>

            <button
                className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={() => signOut()}
            >
                Sign Out
            </button>
        </div>
    );
}
