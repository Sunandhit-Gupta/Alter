"use client";
import axios from "axios";
import { useState } from "react";

export default function AiQuestionDrawer({ onAddQuestion, onClose }) {
    const [prompt, setPrompt] = useState("");
    const [aiQuestion, setAiQuestion] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAiQuestion = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/quiz/generate-question", { prompt });

            if (response.data.data) {
                const { question, options, correctAnswers } = response.data.data;
                setAiQuestion({
                    text: question,
                    options: options.map((opt) => opt.text), // Extracting option texts
                    correctAnswers,
                });
            } else {
                alert("⚠️ Invalid response from AI.");
            }
        } catch (error) {
            console.error("Error fetching AI question:", error);
            alert("⚠️ Failed to generate question. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4">Generate AI Question</h2>
            <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={fetchAiQuestion}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Question"}
            </button>

            {aiQuestion && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <p className="font-semibold">{aiQuestion.text}</p>
                    <ul className="mt-2">
                        {aiQuestion.options.map((opt, i) => (
                            <li key={i} className={`p-2 rounded ${aiQuestion.correctAnswers.includes(opt) ? "bg-green-200" : ""}`}>
                                {opt}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => onAddQuestion(aiQuestion)}>
                            ✅ Add to Quiz
                        </button>
                        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={fetchAiQuestion}>
                            🔄 Next
                        </button>
                    </div>
                </div>
            )}

            <button className="mt-6 block text-red-500 font-bold" onClick={onClose}>
                Close
            </button>
        </div>
    );
}
