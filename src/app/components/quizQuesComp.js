import QuizSettingsComp from '@/app/components/quizSettingsComp';
import axios from "axios";
import { useEffect, useState } from "react";

export default function QuizQuesComp({ quizId }) {
    const [questions, setQuestions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newQuestion, setNewQuestion] = useState(null);
    const [showSettings, setShowSettings] = useState(false); // 🚀 New: Control Settings View

    // 🟢 Fetch Existing Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`/api/quiz/${quizId}/questions`);
                setQuestions(res.data.questions || []);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            }
        };

        if (quizId) fetchQuestions();
    }, [quizId]);

    // 🟢 Add New Question
    const handleAddQuestion = (type) => {
        setNewQuestion({
            type,
            text: "",
            options: [],
            correctAnswers: type === "Subjective" ? [""] : [],
        });
        setShowPopup(false);
    };

    // 🟢 Save Question Locally
    const handleSaveQuestion = () => {
        if (!newQuestion.text.trim()) {
            alert("Question cannot be empty!");
            return;
        }
        setQuestions([...questions, newQuestion]);
        setNewQuestion(null);
    };

    // 🟢 Submit All Questions
    const handleSubmitQuestions = async () => {
        if (!quizId) {
            alert("Quiz ID not found. Please create the quiz first.");
            return;
        }

        try {
            const response = await axios.post("/api/quiz/add-questions", {
                quizId,
                questions,
            });

            if (response.data.success) {
                alert("✅ Questions submitted successfully!");
                setShowSettings(true); // 🚀 Navigate to Settings after submission
            } else {
                alert("❌ Failed to submit questions.");
            }
        } catch (error) {
            console.error("Error submitting questions:", error);
            alert("⚠️ An error occurred while submitting questions.");
        }
    };

    // 🚀 Settings Submission Handler
    const handleSubmitSettings = async (settings) => {
        try {
            const response = await axios.put(`/api/quiz/${quizId}/update-settings`, settings);

            if (response.data.success) {
                alert("✅ Quiz settings updated successfully!");
                setShowSettings(false); // Exit settings view
            } else {
                alert("❌ Failed to update settings.");
            }
        } catch (error) {
            console.error("Error updating quiz settings:", error);
            alert("⚠️ An error occurred while updating settings.");
        }
    };

    // 🔀 Toggle Between Questions & Settings
    if (showSettings) {
        return <QuizSettingsComp onSubmit={handleSubmitSettings} quizId={quizId}/>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Questions</h2>

            {/* 🟢 Display Existing Questions */}
            {questions.length > 0 ? (
                questions.map((q, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-100">
                        <p className="font-semibold">{index + 1}. {q.text}</p>
                        {q.type !== "Subjective" ? (
                            <ul className="mt-2">
                                {q.options.map((opt, i) => (
                                    <li key={i} className={`p-2 rounded ${q.correctAnswers.includes(opt) ? "bg-green-200" : ""}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 italic text-gray-700">Correct Answer: {q.correctAnswers[0]}</p>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No questions added yet.</p>
            )}

            {/* 🟢 Add Question Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-lg font-bold mb-4">Select Question Type</h3>
                        {["Single Correct MCQ", "Multiple Correct MCQ", "Subjective"].map((type) => (
                            <button
                                key={type}
                                className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
                                onClick={() => handleAddQuestion(type)}
                            >
                                {type}
                            </button>
                        ))}
                        <button className="block mt-4 text-red-500 font-bold" onClick={() => setShowPopup(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* 🟢 New Question Form */}
            {newQuestion && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <label className="block text-gray-700 font-medium">Question:</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        placeholder="Enter your question"
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    />

                    {/* MCQ Options */}
                    {(newQuestion.type.includes("MCQ")) && (
                        <div className="mt-4">
                            <label className="block text-gray-700 font-medium">Options:</label>
                            {newQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center mt-2">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={option}
                                        onChange={(e) => {
                                            const updatedOptions = [...newQuestion.options];
                                            updatedOptions[index] = e.target.value;
                                            setNewQuestion({ ...newQuestion, options: updatedOptions });
                                        }}
                                    />
                                    <input
                                        type={newQuestion.type === "Single Correct MCQ" ? "radio" : "checkbox"}
                                        className="ml-2"
                                        checked={newQuestion.correctAnswers.includes(option)}
                                        onChange={() => {
                                            const updatedAnswers = newQuestion.correctAnswers.includes(option)
                                                ? newQuestion.correctAnswers.filter((ans) => ans !== option)
                                                : [...newQuestion.correctAnswers, option];
                                            setNewQuestion({ ...newQuestion, correctAnswers: updatedAnswers });
                                        }}
                                    />
                                </div>
                            ))}
                            <button
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] })}
                            >
                                ➕ Add Option
                            </button>
                        </div>
                    )}

                    {/* Subjective Answer */}
                    {newQuestion.type === "Subjective" && (
                        <div className="mt-4">
                            <label className="block text-gray-700 font-medium">Correct Answer:</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                placeholder="Enter correct answer"
                                value={newQuestion.correctAnswers[0]}
                                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswers: [e.target.value] })}
                            />
                        </div>
                    )}

                    {/* 🟢 Save Question */}
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleSaveQuestion}
                    >
                        💾 Save Question
                    </button>
                </div>
            )}

            {/* 🟢 Action Buttons */}
            <div className="mt-6">
                <button
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    onClick={() => setShowPopup(true)}
                >
                    ➕ Add Another Question
                </button>

                {questions.length > 0 && (
                    <button
                        className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                        onClick={handleSubmitQuestions}
                    >
                        🚀 Submit All Questions
                    </button>
                )}
            </div>
        </div>
    );
}
