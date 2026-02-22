"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UpcomingQuizzes() {
    const { data: session } = useSession();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({});

    // Fetch roll number and quizzes
    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.email) return;

            try {
                const rollRes = await axios.get("/api/user/rollNumber", {
                    params: { email: session.user.email },
                });

                const quizRes = await axios.get("/api/quiz/upcoming", {
                    params: { rollNumber: rollRes.data.rollNumber },
                });

                setQuizzes(quizRes.data);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);

    // Countdown timer
    useEffect(() => {
        if (quizzes.length === 0) return;

        const timer = setInterval(() => {
            const updatedTimeLeft = {};

            quizzes.forEach((quiz) => {
                updatedTimeLeft[quiz._id] = calculateTimeLeft(quiz.startTime);
            });

            setTimeLeft(updatedTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [quizzes]);


    useEffect(() => {
        console.log("Quizzes updated:", quizzes);
    }, [quizzes]);

    const calculateTimeLeft = (startTime) => {
        if (!startTime) return "Undecided";

        const now = new Date();
        const start = new Date(startTime);
        const difference = start - now;

        if (difference <= 0) return "Started";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
            (difference % (1000 * 60)) / 1000
        );

        return `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📅 Upcoming Quizzes</h1>

            {loading ? (
                <SkeletonLoader />
            ) : quizzes.length > 0 ? (
                <ul className="space-y-4">
                    {quizzes.map((quiz) => (
                        <li
                            key={quiz._id}
                            className="p-4 bg-gray-100 rounded-lg shadow"
                        >
                            <h2 className="text-xl font-semibold">
                                {quiz.quizTitle}
                            </h2>
                            <p>{quiz.description}</p>
                            <p>📖 Course Code: {quiz.courseCode}</p>
                            <p>🕒 Duration: {quiz.duration} minutes</p>
                            <p>🎓 Batch: {quiz.batch}</p>
                            <p>🚀 Status: {quiz.status}</p>
                            <p>
                                🔔 Start Time:{" "}
                                {quiz.startTime
                                    ? new Date(quiz.startTime).toLocaleString()
                                    : "To Be Announced"}
                            </p>

                            <p>
                                🏁 End Time:{" "}
                                {quiz.endTime
                                    ? new Date(quiz.endTime).toLocaleString()
                                    : "To Be Announced"}
                            </p>

                            <p
                                className={
                                    calculateTimeLeft(quiz.startTime) === "Started"
                                        ? "text-red-500"
                                        : calculateTimeLeft(quiz.startTime) === "Undecided"
                                        ? "text-gray-500"
                                        : "text-green-600"
                                }
                            >
                                ⏳ Time Left:{" "}
                                {calculateTimeLeft(quiz.startTime)}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming quizzes found.</p>
            )}
        </div>
    );
}

const SkeletonLoader = () => {
    return (
        <ul className="space-y-4">
            {[...Array(3)].map((_, index) => (
                <li
                    key={index}
                    className="p-4 bg-gray-200 animate-pulse rounded-lg shadow-md"
                >
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                </li>
            ))}
        </ul>
    );
};