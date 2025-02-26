"use client";
import axios from "axios";
import { useState } from "react";

export default function SubjectiveScoreCalculator() {
    const [question, setQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [studentAnswer, setStudentAnswer] = useState("");
    const [totalMarks, setTotalMarks] = useState(10);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setScore(null);

        try {
            const response = await axios.post("/api/subjectiveScore", {
                question,
                correctAnswer,
                studentAnswer,
                totalMarks: parseFloat(totalMarks)
            });

            setScore(response.data.score);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to evaluate answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Subjective Score Calculator</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Question:</label>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Correct Answer:</label>
                    <textarea
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Student's Answer:</label>
                    <textarea
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Total Marks:</label>
                    <input
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                        className="w-full p-2 border rounded"
                        min="1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Calculating..." : "Calculate Score"}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                    ⚠️ {error}
                </div>
            )}

            {score !== null && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                    🎯 Student's Score: <strong>{score} / {totalMarks}</strong>
                </div>
            )}
        </div>
    );
}
