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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    // Prevent Text Selection and Copy-Paste
    useEffect(() => {
        document.addEventListener("copy", (e) => e.preventDefault());
        document.addEventListener("paste", (e) => e.preventDefault());
        document.addEventListener("contextmenu", (e) => e.preventDefault());
        document.body.style.userSelect = "none";
        return () => {
            document.removeEventListener("copy", (e) => e.preventDefault());
            document.removeEventListener("paste", (e) => e.preventDefault());
            document.removeEventListener("contextmenu", (e) => e.preventDefault());
            document.body.style.userSelect = "auto";
        };
    }, []);

    // Prevent Tab Switching and Alert on Change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!isSubmitted && document.hidden) {
                alert("⚠️ Warning: You switched tabs! Avoid switching tabs to prevent auto-submission.");
                setTabSwitchCount((prev) => prev + 1);
            }
        };

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "⚠️ Are you sure you want to leave? Your quiz will be submitted.";
            return event.returnValue;
        };

        if (!isSubmitted) {
            document.addEventListener("visibilitychange", handleVisibilityChange);
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isSubmitted]);

    // Auto-submit on excessive tab switching
    useEffect(() => {
        if (!isSubmitted && tabSwitchCount >= 3) {
            alert("❌ You switched tabs too many times! Your quiz is being auto-submitted.");
            handleSubmitQuiz();
        }
    }, [tabSwitchCount, isSubmitted]);

    // Fetch Quiz Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (isSubmitted) return;
            try {
                const res = await axios.get(`/api/quiz/${quizId}/questions`);
                if (res.data.success) {
                    setQuestions(res.data.questions);
                    const initialResponses = {};
                    res.data.questions.forEach((q) => {
                        initialResponses[q._id] = [];
                    });
                    setResponses(initialResponses);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                setError("Failed to load quiz questions.");
            } finally {
                setLoading(false);
            }
        };
        if (quizId) fetchQuestions();
    }, [quizId, isSubmitted]);

    // Handle Answer Change
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
            return { ...prev, [questionId]: [answer] };
        });
    };

    // Submit Quiz
    const handleSubmitQuiz = async () => {
        try {
            const res = await axios.post("/api/quiz/submitted", {
                quizId,
                responses,
                studentEmail: session?.user?.email,
            });
            if (res.data.success) {
                alert("✅ Quiz submitted successfully!");
                router.push("/pages/student/history");
            } else {
                alert(res.data.message || "❌ Failed to submit quiz.");
            }
        } catch (err) {
            alert("⚠️ Error submitting the quiz.");
        }
    };

    if (loading) return <p>🔄 Loading questions...</p>;
    if (isSubmitted) return <p className="text-red-500">✅ You have already submitted this quiz.</p>;
    if (error) return <p className="text-red-500">⚠️ {error}</p>;
    if (!questions.length) return <p>❌ No questions found for this quiz.</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📝 Take Test</h1>
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
                {questions.map((question) => (
                    <div key={question._id} className="mb-6">
                        <p className="font-semibold text-lg mb-3 text-gray-800">{question.text}</p>
                        {question.type === "Subjective" ? (
                            <textarea
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type your answer here..."
                                value={responses[question._id]?.[0] || ""}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value, question.type)}
                            />
                        ) : (
                            question.options.map((option) => (
                                <label key={option} className="block p-3 border rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-2">
                                    <input type={question.type === "Single Correct MCQ" ? "radio" : "checkbox"} name={`q-${question._id}`} value={option} onChange={() => handleAnswerChange(question._id, option, question.type)} />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))
                        )}
                    </div>
                ))}
                <button onClick={handleSubmitQuiz} className="w-full mt-4 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">📤 Submit Quiz</button>
            </div>
        </div>
    );
}
