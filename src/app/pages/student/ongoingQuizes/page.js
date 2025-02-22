"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OngoingQuizes() {
    const { data: session } = useSession();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch ongoing quizzes
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!session?.user?.email) return;

            try {
                const rollRes = await axios.get(`/api/user/rollNumber?email=${session.user.email}`);
                const rollNumber = rollRes.data?.rollNumber;

                if (!rollNumber) {
                    setError("Failed to fetch roll number.");
                    return;
                }

                const quizRes = await axios.get(`/api/quiz/ongoing?rollNumber=${rollNumber}`);
                setQuizzes(quizRes.data);
            } catch (err) {
                console.error("Failed to fetch ongoing quizzes:", err);
                setError("Failed to load ongoing quizzes.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [session]);

    // Navigate to the Take Test page
    const handleTakeTest = (quizId) => {
        router.push(`/student/takeTest?quizId=${quizId}`);
    };

    if (loading) return <p>Loading ongoing quizzes...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ongoing Quizzes</h1>

            {quizzes.length > 0 ? (
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
                                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
