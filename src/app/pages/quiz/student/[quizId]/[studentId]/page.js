"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function StudentQuizResponse() {
    const { quizId, studentId } = useParams();
    const [response, setResponse] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResponseDetails = async () => {
            try {
                const res = await axios.get(`/api/quiz/response?quizId=${quizId}&studentId=${studentId}`);
                setResponse(res.data.response);
                setQuiz(res.data.quiz);
            } catch (err) {
                console.error("Failed to fetch response details:", err);
                setError("Failed to load response details.");
            } finally {
                setLoading(false);
            }
        };
        fetchResponseDetails();
    }, [quizId, studentId]);

    const SkeletonLoader = () => (
        <div className="p-6 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-80 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) return <SkeletonLoader />;
    if (error) return <p className="text-red-600 text-center font-semibold text-lg p-6">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold mb-4 text-[#4A90E2] tracking-tight">
                {quiz?.quizTitle} - Student Response
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
                Responses for {response?.studentName} (Roll: {response?.rollNumber})
            </p>
            <div className="space-y-6">
                {response?.responses.map((resp, index) => {
                    const question = quiz?.questions.find((q) => q._id === resp.questionId);
                    const isCorrect = resp.givenAnswer.every((ans) => question.correctAnswers.includes(ans)) &&
                                     question.correctAnswers.every((ans) => resp.givenAnswer.includes(ans));

                    return (
                        <div
                            key={index}
                            className="p-5 bg-white border border-gray-200 rounded-lg shadow-md"
                        >
                            <h3 className="text-xl font-semibold text-[#FF6F61] mb-2">
                                Q{index + 1}: {question?.text}
                            </h3>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Type:</span> {question?.type}
                            </p>
                            {question?.options.length > 0 && (
                                <div className="mb-2">
                                    <span className="font-semibold text-gray-800">Options:</span>
                                    <ul className="list-disc pl-5 text-gray-600">
                                        {question.options.map((opt, idx) => (
                                            <li key={idx}>{opt}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-gray-700 mb-2 flex items-center gap-2">
                                <span className="font-semibold text-gray-800">Student Answer:</span>
                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                    {resp.givenAnswer.join(", ") || "Not answered"}
                                    {isCorrect ? (
                                        <FaCheckCircle className="inline ml-2" />
                                    ) : (
                                        <FaTimesCircle className="inline ml-2" />
                                    )}
                                </span>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold text-gray-800">Correct Answer:</span>{" "}
                                <span className="text-green-600">{question?.correctAnswers.join(", ")}</span>
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold text-gray-800">Auto Score:</span>{" "}
                                <span className="text-green-600">{resp.autoScore}/{question?.points}</span>
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold text-gray-800">Score:</span>{" "}
                                <span className="text-green-600">{resp.finalScore}/{question?.points}</span>
                            </p>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800 font-semibold">
                    Total Auto Score: <span className="text-green-600">{response?.totalAutoScore}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                    Total Score: <span className="text-green-600">{response?.totalFinalScore}</span>
                </p>
                <p className="text-gray-800">
                    Submitted At: {new Date(response?.submittedAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
}