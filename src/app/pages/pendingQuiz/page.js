"use client";
import QuizSettingsComp from "@/app/components/quizSettingsComp";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PendingQuiz() {
    const [pendingQuizzes, setPendingQuizzes] = useState([]);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [settingsQuizId, setSettingsQuizId] = useState(null);
    const [formData, setFormData] = useState({});
    const router = useRouter();

    useEffect(() => {
        fetchPendingQuizzes();
    }, []);

    const fetchPendingQuizzes = async () => {
        try {
            const res = await axios.get("/api/quiz/pending");
            setPendingQuizzes(res.data);
        } catch (error) {
            console.error("Failed to fetch pending quizzes:", error);
        }
    };

    const handleAddQuestions = (quizId) => {
        router.push(`/pages/quiz/add-questions/${quizId}`);
    };

    const handleEditQuiz = (quiz) => {
        setEditingQuiz(quiz._id);
        setFormData({
            quizTitle: quiz.quizTitle,
            description: quiz.description,
            courseCode: quiz.courseCode,
            batch: quiz.batch,
        });
    };

    const handleUpdateQuiz = async (quizId) => {
        try {
            await axios.put("/api/quiz/pending", { quizId, ...formData });
            alert("Quiz updated successfully!");
            setEditingQuiz(null);
            fetchPendingQuizzes();
        } catch (error) {
            console.error("Failed to update quiz:", error);
            alert("Failed to update quiz.");
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (confirm("Are you sure you want to delete this quiz?")) {
            try {
                await axios.delete("/api/quiz/pending", { data: { quizId } });
                alert("Quiz deleted successfully!");
                fetchPendingQuizzes();
            } catch (error) {
                console.error("Failed to delete quiz:", error);
                alert("Failed to delete quiz.");
            }
        }
    };

    const handleSettingsSubmit = async (quizId, settings) => {
        try {
            await axios.put("/api/quiz/settings", { quizId, settings });
            alert("Quiz settings updated successfully!");
            setSettingsQuizId(null);
            fetchPendingQuizzes();
        } catch (error) {
            console.error("Failed to update quiz settings:", error);
            alert("Failed to update quiz settings.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pending Quizzes</h1>

            {settingsQuizId ? (
                <div className="mb-6">
                    <QuizSettingsComp
                        quizId={settingsQuizId}
                        onSubmit={(settings) => handleSettingsSubmit(settingsQuizId, settings)}
                    />
                    <button
                        onClick={() => setSettingsQuizId(null)}
                        className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        🔙 Back to Quizzes
                    </button>
                </div>
            ) : (
                <ul className="space-y-4">
                    {pendingQuizzes.length > 0 ? (
                        pendingQuizzes.map((quiz) => (
                            <li key={quiz._id} className="p-4 bg-gray-100 rounded-lg shadow">
                                {editingQuiz === quiz._id ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="quizTitle"
                                            value={formData.quizTitle}
                                            onChange={handleInputChange}
                                            placeholder="Quiz Title"
                                            className="w-full p-2 border rounded"
                                        />
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Description"
                                            className="w-full p-2 border rounded"
                                        ></textarea>
                                        <input
                                            type="text"
                                            name="courseCode"
                                            value={formData.courseCode}
                                            onChange={handleInputChange}
                                            placeholder="Course Code"
                                            className="w-full p-2 border rounded"
                                        />
                                        <input
                                            type="text"
                                            name="batch"
                                            value={formData.batch}
                                            onChange={handleInputChange}
                                            placeholder="Batch"
                                            className="w-full p-2 border rounded"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateQuiz(quiz._id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                💾 Save
                                            </button>
                                            <button
                                                onClick={() => setEditingQuiz(null)}
                                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                            >
                                                ❌ Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl font-semibold">{quiz.quizTitle}</h2>
                                        <p>{quiz.description}</p>
                                        <p>Course: {quiz.courseCode}</p>
                                        <p>Batch: {quiz.batch}</p>
                                        <p>Created by: {quiz.createdByName || "Unknown"}</p>

                                        <div className="mt-3 flex gap-3">
                                            <button
                                                onClick={() => handleAddQuestions(quiz._id)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                ➕ Add Questions
                                            </button>

                                            <button
                                                onClick={() => handleEditQuiz(quiz)}
                                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                onClick={() => setSettingsQuizId(quiz._id)}
                                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                            >
                                                ⚙️ Settings
                                            </button>

                                            <button
                                                onClick={() => handleDeleteQuiz(quiz._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No pending quizzes found.</p>
                    )}
                </ul>
            )}
        </div>
    );
}
