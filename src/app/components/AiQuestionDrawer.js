"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AiQuestionDrawer({ onAddQuestion, onClose }) {
    const [prompt, setPrompt] = useState("");
    const [questionType, setQuestionType] = useState("single");
    const [aiQuestions, setAiQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(5); // Default 5

    const fetchAiQuestions = async () => {
        if (!prompt.trim()) {
            toast.warning("Please enter a prompt!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/api/quiz/generate-question", {
                prompt,
                type: questionType,
                count: questionCount,
            });

            if (response.data.data) {
                const structuredQuestions = response.data.data;

                if (!Array.isArray(structuredQuestions)) {
                    throw new Error("Invalid response format.");
                }

                const parsedQuestions = structuredQuestions.map((q, index) => ({
                    id: index + 1,
                    text: q.text,
                    options: Array.isArray(q.options)
                        ? q.options.map(opt => typeof opt === "object" ? opt.text : opt)
                        : [],
                    correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : [],
                    type: q.type,
                    images: Array.isArray(q.images) ? q.images : [],
                    points: q.points || 1
                }));

                setAiQuestions(parsedQuestions);
            } else {
                toast.error("Invalid response from AI.");
            }
        } catch (error) {
            console.error("Error fetching AI questions:", error);
            toast.error("Failed to generate questions. Try again.");
        }

        setLoading(false);
    };

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Generate AI Questions</h2>
                <button className="text-red-500 font-bold" onClick={onClose}>
                    ✖
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">

                {/* Question Type */}
                <select
                    className="w-full p-2 border border-gray-300 rounded mb-3 bg-white focus:outline-none"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                >
                    <option value="single">Single Correct MCQ</option>
                    <option value="multiple">Multiple Correct MCQ</option>
                    <option value="mixed">Mixed</option>
                </select>

                {/* Prompt */}
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter topic or prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                {/* Question Count Boxes */}
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                        Number of Questions
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 15, 20].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setQuestionCount(num)}
                                className={`py-2 rounded-lg border text-sm font-medium transition
                                    ${
                                        questionCount === num
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
                    onClick={fetchAiQuestions}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Questions"}
                </button>

                {/* AI Questions List */}
                {aiQuestions.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {aiQuestions.map((question, qIndex) => (
                            <div key={qIndex} className="p-4 border rounded bg-gray-100">
                                <p className="font-semibold">{question.text}</p>
                                {question.images?.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {question.images.map((img, i) => (
                                            <img key={i} src={img} className="h-24 rounded border" />
                                        ))}
                                    </div>
                                )}
                                <ul className="mt-2">
                                    {question.options.map((opt, i) => (
                                        <li
                                            key={i}
                                            className={`p-2 rounded ${question.correctAnswers.includes(opt)
                                                ? "bg-green-200"
                                                : ""
                                                }`}
                                        >
                                            {opt}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`mt-2 px-4 py-2 rounded w-full text-white ${
                                        question.added
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                    disabled={question.added}
                                    onClick={() => {
                                        if (question.added) return;

                                        onAddQuestion({
                                            ...question,
                                            images: question.images || []
                                        });

                                        // Mark this question as added
                                        setAiQuestions(prev =>
                                            prev.map((q, index) =>
                                                index === qIndex ? { ...q, added: true } : q
                                            )
                                        );
                                    }}
                                >
                                    {question.added ? "✔ Added" : "✅ Add to Quiz"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Next Questions */}
            <div className="p-6 border-t">
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
                    onClick={fetchAiQuestions}
                    disabled={loading}
                >
                    🔄 Next Questions
                </button>
            </div>
        </div>
    );
}