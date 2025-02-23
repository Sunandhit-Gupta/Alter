"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TakeTestPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const quizId = searchParams.get("quizId");

    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState("");

    // 🟢 Fetch Quiz Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`/api/quiz/${quizId}/questions`);
                if (res.data.success) {
                    setQuestions(res.data.questions);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                console.error("Failed to fetch questions:", err);
                setError("Failed to load quiz questions.");
            }
        };

        if (quizId) fetchQuestions();
    }, [quizId]);

    // 🟢 Handle Single & Multiple Choice Answers
    const handleAnswerChange = (questionId, answer, type) => {
        setResponses((prev) => {
            const current = prev[questionId] || [];

            if (type === "Single Correct MCQ") {
                return { ...prev, [questionId]: [answer] };
            }

            if (type === "Multiple Correct MCQ") {
                const updatedAnswers = current.includes(answer)
                    ? current.filter((a) => a !== answer)
                    : [...current, answer];
                return { ...prev, [questionId]: updatedAnswers };
            }

            return { ...prev, [questionId]: [answer] }; // Subjective
        });
    };

    // 🟢 Submit Quiz
    const handleSubmitQuiz = async () => {
        if (Object.keys(responses).length !== questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        try {
            const res = await axios.post("/api/quiz/student/submit", {
                quizId,
                responses,
                studentEmail: session?.user?.email,
            });

            if (res.data.success) {
                alert("Quiz submitted successfully!");
                router.push("/pages/student/history");
            } else {
                alert(res.data.message || "Failed to submit quiz.");
            }
        } catch (err) {
            console.error("Failed to submit quiz:", err);
            alert("Failed to submit the quiz.");
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (!questions.length) return <p>Loading questions...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Take Test</h1>

            {questions.map((question) => (
                <div key={question._id} className="mb-6">
                    <p className="font-medium">{question.text}</p>

                    {question.type === "Single Correct MCQ" && (
                        question.options.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="radio"
                                    name={`question-${question._id}`}
                                    value={option}
                                    checked={responses[question._id]?.includes(option)}
                                    onChange={() => handleAnswerChange(question._id, option, question.type)}
                                />
                                {option}
                            </label>
                        ))
                    )}

                    {question.type === "Multiple Correct MCQ" && (
                        question.options.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={responses[question._id]?.includes(option)}
                                    onChange={() => handleAnswerChange(question._id, option, question.type)}
                                />
                                {option}
                            </label>
                        ))
                    )}

                    {question.type === "Subjective" && (
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Type your answer here..."
                            value={responses[question._id]?.[0] || ""}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value, question.type)}
                        />
                    )}
                </div>
            ))}

            <button
                onClick={handleSubmitQuiz}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
                📤 Submit Quiz
            </button>
        </div>
    );
}
