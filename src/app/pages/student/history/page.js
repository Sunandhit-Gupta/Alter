"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function History() {
    const { data: session } = useSession();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await axios.get(`/api/quiz/student/history?email=${session.user.email}`);
                setHistory(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch quiz history:", err);
                setError("⚠️ Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [session]);

    if (loading) return <p>Loading history...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📜 Quiz History</h1>

            {history.length > 0 ? (
                <ul className="space-y-4">
                    {history.map((entry) => (
                        <li key={entry._id} className="p-4 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{entry.quizTitle}</h2>
                            <p>📜 Roll Number: {entry.rollNumber}</p>
                            <p>⚙️ Auto Score: {entry.totalAutoScore}</p>
                            <p>🏆 Final Score: {entry.totalFinalScore}</p>
                            {entry.submittedAt ? (
                                <p>📅 Submitted At: {new Date(entry.submittedAt).toLocaleString()}</p>
                            ) : (
                                <p className="text-yellow-500">⚠️ Not Attempted</p>
                            )}
                            <p className={`mt-2 font-bold ${entry.status === 'Missed' ? 'text-red-500' : 'text-green-500'}`}>
                                🚩 Status: {entry.status}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No quiz history available yet.</p>
            )}
        </div>
    );
}
