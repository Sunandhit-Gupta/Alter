"use client";
import QuestionForm from "@/app/components/QuestionForm";
import QuestionList from "@/app/components/QuestionList";
import QuestionPopup from "@/app/components/QuestionPopup";
import QuizSettingsComp from "@/app/components/quizSettingsComp";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizQuesComp({ quizId }) {
    const [questions, setQuestions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newQuestion, setNewQuestion] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const router = useRouter();

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

    const handleAddQuestion = (type) => {
        setNewQuestion({
            type,
            text: "",
            options: [],
            correctAnswers: type === "Subjective" ? [""] : [],
        });
        setShowPopup(false);
    };

    const handleSaveQuestion = () => {
        if (!newQuestion.text.trim()) {
            alert("⚠️ Question cannot be empty!");
            return;
        }
        if (newQuestion.type !== "Subjective" && newQuestion.correctAnswers.length === 0) {
            alert("⚠️ Please select at least one correct answer!");
            return;
        }
        setQuestions([...questions, newQuestion]);
        setNewQuestion(null);
    };

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
                setShowSettings(true);
            } else {
                alert("❌ Failed to submit questions.");
            }
        } catch (error) {
            console.error("Error submitting questions:", error);
            alert("⚠️ An error occurred while submitting questions.");
        }
    };

    const handleSubmitSettings = async (settings) => {
        try {
            const response = await axios.put(`/api/quiz/${quizId}/update-settings`, settings);
            if (response.data.success) {
                alert("✅ Quiz settings updated successfully!");
                router.replace("/pages/pendingQuiz");
            } else {
                alert("❌ Failed to update settings.");
            }
        } catch (error) {
            console.error("Error updating quiz settings:", error);
            alert("⚠️ An error occurred while updating settings.");
        }
    };

    if (showSettings) {
        return <QuizSettingsComp onSubmit={handleSubmitSettings} quizId={quizId} />;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Questions</h2>
            <QuestionList questions={questions} />
            <QuestionPopup showPopup={showPopup} setShowPopup={setShowPopup} handleAddQuestion={handleAddQuestion} />
            <QuestionForm newQuestion={newQuestion} setNewQuestion={setNewQuestion} handleSaveQuestion={handleSaveQuestion} />
            <div className="mt-6">
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={() => setShowPopup(true)}>
                    ➕ Add Another Question
                </button>
                {questions.length > 0 && (
                    <button className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600" onClick={handleSubmitQuestions}>
                        🚀 Submit All Questions
                    </button>
                )}
            </div>
        </div>
    );
}
