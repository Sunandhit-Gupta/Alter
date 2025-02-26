"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // 🚀 Import router for navigation
import { useEffect, useState } from "react";

export default function TeacherQuizHistory() {
    const { data: session } = useSession();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter(); // ✅ Use router for navigation

    useEffect(() => {
        const fetchTeacherHistory = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await axios.get(`/api/quiz/history?email=${session.user.email}`);
                setQuizzes(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch teacher quiz history:", err);
                setError("⚠️ Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherHistory();
    }, [session]);

    // Skeleton Loader Component for better UX
    const SkeletonLoader = () => (
        <div className="p-6 animate-pulse">
            <div className="h-8 w-56 bg-gray-300 rounded mb-4"></div>
            <ul className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                        <div className="h-6 w-64 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 w-40 bg-gray-300 rounded mb-1"></div>
                        <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (loading) return <SkeletonLoader />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 Quiz Management History</h1>
            <p className="text-gray-600 mb-6">
                View all quizzes you have created and their completion details.
            </p>

            {quizzes.length > 0 ? (
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li key={quiz._id} className="p-4 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">📝 {quiz.quizTitle}</h2>
                            <p className="text-gray-700">📖 Course Code: <strong>{quiz.courseCode}</strong></p>
                            <p className="text-gray-700">🎓 Batch: <strong>{quiz.batch}</strong></p>
                            <p className="text-gray-700">👨‍🎓 Students Attempted: <strong>{quiz.studentCount}</strong></p>
                            <p className="text-gray-700">🏆 Avg. Auto Final Score: <strong>{quiz.avgAutoFinalScore}</strong></p>
                            <p className="text-gray-700">🏆 Avg. Final Score: <strong>{quiz.avgFinalScore}</strong></p>
                            <p className="text-gray-700">📅 Created At: <strong>{new Date(quiz.createdAt).toLocaleString()}</strong></p>

                            {/* 🚀 View Details Button */}
                            <button
                                onClick={() => router.push(`/pages/quiz/attempts/${quiz._id}`)}
                                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No quizzes found in your history.</p>
            )}
        </div>
    );
}
// /quiz/details/${quiz._id}