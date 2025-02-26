"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OngoingQuizzes() {
    const { data: session } = useSession();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!session?.user?.email) return;

            try {
                const userRes = await axios.get(`/api/user/submittedQuizzes?email=${session.user.email}`);
                const submittedQuizzes = userRes.data?.submittedQuizzes || [];

                const rollRes = await axios.get(`/api/user/rollNumber?email=${session.user.email}`);
                const rollNumber = rollRes.data?.rollNumber;

                const quizRes = await axios.get(`/api/quiz/ongoing?rollNumber=${rollNumber}`);
                const filteredQuizzes = quizRes.data.filter((quiz) => !submittedQuizzes.includes(quiz._id));

                setQuizzes(filteredQuizzes);
            } catch (err) {
                console.error("Failed to fetch ongoing quizzes:", err);
                setError("Failed to load ongoing quizzes.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [session]);

    const handleTakeTest = (quizId) => {
        router.push(`/pages/student/takeTest?quizId=${quizId}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ongoing Quizzes</h1>

            {loading ? (
                <SkeletonLoader />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : quizzes.length > 0 ? (
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li key={quiz._id} className="p-4 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{quiz.quizTitle}</h2>
                            <p>{quiz.description}</p>
                            <p>Course Code: {quiz.courseCode}</p>
                            <p>Batch: {quiz.batch}</p>
                            <p>Started at: {new Date(quiz.startTime).toLocaleString()}</p>

                            <button
                                onClick={() => handleTakeTest(quiz._id)}
                                className="mt-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            >
                                Take Test
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No ongoing quizzes available for your roll number.</p>
            )}
        </div>
    );
}

// Skeleton Loader Component
const SkeletonLoader = () => {
    return (
        <ul className="space-y-4">
            {[...Array(3)].map((_, index) => (
                <li key={index} className="p-4 bg-gray-200 animate-pulse rounded-lg shadow-md">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div> {/* Quiz Title */}
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div> {/* Description */}
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div> {/* Course Code */}
                    <div className="h-4 bg-gray-300 rounded w-full"></div> {/* Batch Info */}
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div> {/* Start Time */}

                    <div className="mt-4 h-10 bg-gray-400 rounded w-1/3"></div> {/* Button Placeholder */}
                </li>
            ))}
        </ul>
    );
};