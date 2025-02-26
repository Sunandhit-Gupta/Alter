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
    const [hasSwitchedTab, setHasSwitchedTab] = useState(false);

    // 🔴 Restrict Tab Switching
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!isSubmitted && document.hidden) {
                setHasSwitchedTab(true);
                setTabSwitchCount((prev) => prev + 1);
            }
        };

        const handleFocus = () => {
            if (hasSwitchedTab) {
                alert("⚠️ Warning: Do not switch tabs! Your quiz may be auto-submitted.");
                setHasSwitchedTab(false);
            }
        };

        // ❌ Prevent Closing or Reloading
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "⚠️ Are you sure you want to leave? Your quiz will be submitted.";
            return event.returnValue;
        };

        if (!isSubmitted) {
            document.addEventListener("visibilitychange", handleVisibilityChange);
            window.addEventListener("focus", handleFocus);
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isSubmitted, hasSwitchedTab]);


    // 🚨 Auto-submit if tab is switched too many times
    useEffect(() => {
        if (!isSubmitted && tabSwitchCount >= 3) {
            alert("❌ You switched tabs too many times! Your quiz is being auto-submitted.");
            handleSubmitQuiz();
        }
    }, [tabSwitchCount, isSubmitted]);

    // 🔍 Check if Quiz is Already Submitted
    useEffect(() => {
        const checkSubmission = async () => {
            try {
                const res = await axios.get(`/api/user/submittedQuizzes?email=${session?.user?.email}`);
                const submittedQuizIds = res.data?.submittedQuizzes || [];

                if (submittedQuizIds.includes(quizId)) {
                    setIsSubmitted(true);
                }
            } catch (err) {
                console.error("Failed to check submission:", err);
            }
        };

        if (quizId && session?.user?.email) checkSubmission();
    }, [quizId, session]);

    // 📝 Fetch Quiz Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (isSubmitted) return;

            try {
                const res = await axios.get(`/api/quiz/${quizId}/questions`);
                if (res.data.success) {
                    setQuestions(res.data.questions);

                    // ✅ Initialize responses properly
                    const initialResponses = {};
                    res.data.questions.forEach((q) => {
                        initialResponses[q._id] = [];
                    });
                    setResponses(initialResponses);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                console.error("Failed to fetch questions:", err);
                setError("Failed to load quiz questions.");
            } finally {
                setLoading(false);
            }
        };

        if (quizId) fetchQuestions();
    }, [quizId, isSubmitted]);

    // 🟢 Handle Answer Change
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

    // 🚀 Submit Quiz
    const handleSubmitQuiz = async () => {
        // const unanswered = questions.filter((q) => !responses[q._id]?.length);
        // if (unanswered.length) {
        //     alert(`Please answer all questions before submitting.`);
        //     return;
        // }

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
            console.error("Failed to submit quiz:", err);
            alert("⚠️ Error submitting the quiz.");
        }
    };

    if (loading) return <p>🔄 Loading questions...</p>;
    if (isSubmitted) return <p className="text-red-500">✅ You have already submitted this quiz.</p>;
    if (error) return <p className="text-red-500">⚠️ {error}</p>;
    if (!questions.length) return <p>❌ No questions found for this quiz.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📝 Take Test</h1>

            {questions.map((question) => (
                <div key={question._id} className="mb-6">
                    <p className="font-medium">{question.text}</p>

                    {/* ✅ Single Correct MCQ */}
                    {question.type === "Single Correct MCQ" &&
                        question.options.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="radio"
                                    name={`question-${question._id}`}
                                    value={option}
                                    checked={responses[question._id]?.includes(option) || false}
                                    onChange={() => handleAnswerChange(question._id, option, question.type)}
                                />
                                {option}
                            </label>
                        ))}

                    {/* ✅ Multiple Correct MCQ */}
                    {question.type === "Multiple Correct MCQ" &&
                        question.options.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={responses[question._id]?.includes(option) || false}
                                    onChange={() => handleAnswerChange(question._id, option, question.type)}
                                />
                                {option}
                            </label>
                        ))}

                    {/* ✅ Subjective Answer */}
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
