"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TakeTestPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const quizId = searchParams.get("quizId");

    const [isBlurred, setIsBlurred] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    useEffect(() => {
        const enterFullscreen = () => {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !isSubmitted) {
                toast.warning("Warning: You exited fullscreen! Click the button to re-enter.");
                setTabSwitchCount((prev) => prev + 1);
                setIsBlurred(true);
            }
        };

        enterFullscreen();
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [isSubmitted]);

    const handleGoFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        setIsBlurred(false);
    };

    useEffect(() => {
        const preventActions = (e) => e.preventDefault();
        document.addEventListener("copy", preventActions);
        document.addEventListener("paste", preventActions);
        document.addEventListener("contextmenu", preventActions);
        document.body.style.userSelect = "none";
        return () => {
            document.removeEventListener("copy", preventActions);
            document.removeEventListener("paste", preventActions);
            document.removeEventListener("contextmenu", preventActions);
            document.body.style.userSelect = "auto";
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!isSubmitted && document.hidden) {
                toast.warning("Warning: You switched tabs! Avoid switching tabs to prevent auto-submission.");
                setTabSwitchCount((prev) => prev + 1);
            }
        };

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave? Your quiz will be submitted.";
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

    useEffect(() => {
        if (!isSubmitted && tabSwitchCount >= 3) {
            toast.error("You switched tabs too many times! Your quiz is being auto-submitted.");
            handleSubmitQuiz();
        }
    }, [tabSwitchCount, isSubmitted]);

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

    const handleSubmitQuiz = async () => {
        try {
            const res = await axios.post("/api/quiz/submitted", {
                quizId,
                responses,
                studentEmail: session?.user?.email,
            });
            if (res.data.success) {
                toast.success("Quiz submitted successfully!");
                router.push("/pages/student/history");
            } else {
                toast.error(res.data.message || "Failed to submit quiz.");
            }
        } catch (err) {
            toast.error("Error submitting the quiz.");
        }
    };

    return (
        <>
                    {(isBlurred &&
                <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-50">
                    <p className="text-white text-xl mb-4">⚠ You exited fullscreen! Click below to re-enter.</p>
                    <button 
                        onClick={handleGoFullscreen} 
                        className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-red-600 pointer-events-auto"
                    >
                        🔲 Re-Enter Fullscreen
                    </button>
                </div>
            )}
        <div className={`p-6 min-h-screen ${isBlurred ? "filter blur-lg pointer-events-none" : ""}`}>

    
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
                                    <input 
                                        type={question.type === "Single Correct MCQ" ? "radio" : "checkbox"} 
                                        name={`q-${question._id}`} 
                                        value={option} 
                                        onChange={() => handleAnswerChange(question._id, option, question.type)} 
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))
                        )}
                    </div>
                ))}
                <button 
                    onClick={handleSubmitQuiz} 
                    className="w-full mt-4 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                >
                    📤 Submit Quiz
                </button>
            </div>
        </div>
        </>
    );
}
