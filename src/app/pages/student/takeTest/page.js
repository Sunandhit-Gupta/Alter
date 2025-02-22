"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TakeTestPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const quizId = searchParams.get("quizId");

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");

    // Fetch quiz questions using the existing API route
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`/api/quiz/${quizId}/questions`);
                if (res.data.success) {
                    setQuiz(res.data.questions);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                console.error("Failed to fetch quiz questions:", err);
                setError("Failed to load quiz questions.");
            }
        };

        if (quizId) fetchQuiz();
    }, [quizId]);

    // Handle answer change
    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    // Lock the test
    const handleLockTest = async () => {
        if (Object.keys(answers).length !== quiz?.length) {
            alert("Please answer all questions before locking the test.");
            return;
        }

        try {
            await axios.post("/api/quiz/student/submit", {
                quizId,
                answers,
                studentEmail: session?.user?.email
            });

            setLocked(true);
            alert("Test locked successfully! Waiting for results after quiz ends.");
        } catch (err) {
            console.error("Failed to lock test:", err);
            alert("Failed to lock the test. Try again.");
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (!quiz) return <p>Loading quiz questions...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>

            {quiz.map((question) => (
                <div key={question._id} className="mb-6">
                    <p className="font-medium">{question.text}</p>

                    {question.type === "MCQ" ? (
                        question.options.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="radio"
                                    name={`question-${question._id}`}
                                    value={option}
                                    disabled={locked}
                                    checked={answers[question._id] === option}
                                    onChange={() => handleAnswerChange(question._id, option)}
                                />
                                {option}
                            </label>
                        ))
                    ) : (
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Type your answer here..."
                            disabled={locked}
                            value={answers[question._id] || ""}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        />
                    )}
                </div>
            ))}

            {!locked ? (
                <button
                    onClick={handleLockTest}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    🔒 Lock Test
                </button>
            ) : (
                <p className="text-green-600">✅ Test Locked! Waiting for results.</p>
            )}
        </div>
    );
}
