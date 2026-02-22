"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AiQuestionDrawer({ onAddQuestion, onClose }) {
    const [prompt, setPrompt] = useState("");
    const [aiQuestions, setAiQuestions] = useState([]); // Store multiple questions
    const [loading, setLoading] = useState(false);

    const fetchAiQuestions = async () => {
        if (!prompt.trim()) {
            toast.warning("Please enter a prompt!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/quiz/generate-question", { prompt });

            if (response.data.data) {
                const structuredQuestions = response.data.data;

                console.log(structuredQuestions);
                // Ensure structuredQuestions.questions exists and is an array
                if (!Array.isArray(structuredQuestions) || !structuredQuestions) {
                    throw new Error("Invalid response format: questions not found.");
                }

                // Map the received questions properly
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

                setAiQuestions(parsedQuestions); // Store multiple questions properly
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
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transition-transform duration-300 flex flex-col">
            {/* Header Section */}
            <div className="p-6 border-b flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold">Generate AI Questions</h2>
                <button className="text-red-500 font-bold" onClick={onClose}>
                    ✖
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                    className="mt-3 bg-blue-500 text-white px-4 py-2 rounded w-full"
                    onClick={fetchAiQuestions}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Questions"}
                </button>

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
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full"
                                    onClick={() =>
                                        onAddQuestion({
                                            ...question,
                                            images: question.images || []
                                        })
                                    }
                                >
                                    ✅ Add to Quiz
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* "Next" Button */}
            <div className="p-6 border-t bg-white">
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
