"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UpcomingQuizzes() {
    const { data: session } = useSession();
    const [quizzes, setQuizzes] = useState([]);
    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserRollNumber();
        }
    }, [session]);

    const fetchUserRollNumber = async () => {
        try {
            const res = await axios.get("/api/user/rollNumber", {
                params: { email: session.user.email },
            });
            setRollNumber(res.data.rollNumber);
            fetchUpcomingQuizzes(res.data.rollNumber);
        } catch (error) {
            console.error("Failed to fetch user roll number:", error);
        }
    };

    const fetchUpcomingQuizzes = async (roll) => {
        try {
            const res = await axios.get("/api/quiz/upcoming", {
                params: { rollNumber: roll },
            });
            setQuizzes(res.data);
        } catch (error) {
            console.error("Failed to fetch upcoming quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📅 Upcoming Quizzes</h1>

            {loading ? (
                <SkeletonLoader />
            ) : quizzes.length > 0 ? (
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li key={quiz._id} className="p-4 bg-gray-100 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{quiz.quizTitle}</h2>
                            <p>{quiz.description}</p>
                            <p>📖 Course Code: {quiz.courseCode}</p>
                            <p>🕒 Duration: {quiz.duration} minutes</p>
                            <p>🎓 Batch: {quiz.batch}</p>
                            <p>🚀 Status: {quiz.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming quizzes found for your roll number.</p>
            )}
        </div>
    );
}

const SkeletonLoader = () => {
    return (
        <ul className="space-y-4">
            {[...Array(3)].map((_, index) => (
                <li key={index} className="p-4 bg-gray-200 animate-pulse rounded-lg shadow-md">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div> {/* Quiz Title */}
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div> {/* Description */}
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div> {/* Course Code */}
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Duration */}
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div> {/* Batch */}
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Status */}
                </li>
            ))}
        </ul>
    );
};