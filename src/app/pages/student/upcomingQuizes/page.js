"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UpcomingQuizes() {
    const { data: session } = useSession();
    const [quizzes, setQuizzes] = useState([]);
    const [rollNumber, setRollNumber] = useState("");

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
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📅 Upcoming Quizzes</h1>

            {quizzes.length > 0 ? (
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
