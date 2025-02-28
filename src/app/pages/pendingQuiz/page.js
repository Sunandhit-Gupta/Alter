"use client";

import PendingQuizItem from "@/app/components/PendingQuizItem";
import QuizSettingsComp from "@/app/components/quizSettingsComp";
import {
    deleteQuiz,
    endQuiz,
    fetchPendingQuizzes,
    publishQuiz,
    startQuiz,
    updateQuiz,
    updateQuizSettings,
} from "@/app/services/pendingQuizService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PendingQuiz() {
  const [pendingQuizzes, setPendingQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [settingsQuizId, setSettingsQuizId] = useState(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    loadPendingQuizzes();
  }, []);

  const loadPendingQuizzes = async () => {
    try {
      const quizzes = await fetchPendingQuizzes();
      setPendingQuizzes(quizzes);
    } catch (error) {
      console.error("Failed to fetch pending quizzes:", error);
    }
  };

  const handlePublishQuiz = async (quizId) => {
    try {
      await publishQuiz(quizId);
      toast.success("Quiz published successfully!");
      loadPendingQuizzes();
    } catch (error) {
      console.error("Failed to publish quiz:", error);
      toast.error("Failed to publish quiz.");
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      await startQuiz(quizId);
      toast.success("Quiz started successfully!");
      loadPendingQuizzes();
    } catch (error) {
      console.error("Failed to start quiz:", error);
      toast.error("Failed to start quiz.");
    }
  };

  const handleEndQuiz = async (quizId) => {
    if (confirm("Are you sure you want to end this quiz?")) {
      try {
        await endQuiz(quizId);
        toast.success("Quiz ended successfully!");
        loadPendingQuizzes();
      } catch (error) {
        console.error("Failed to end quiz:", error);
        toast.error("Failed to end quiz.");
      }
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
      await updateQuiz(quizId, formData);
      toast.success("Quiz updated successfully!");
      setEditingQuiz(null);
      loadPendingQuizzes();
    } catch (error) {
      console.error("Failed to update quiz:", error);
      toast.error("Failed to update quiz.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(quizId);
        toast.success("Quiz deleted successfully!");
        loadPendingQuizzes();
      } catch (error) {
        console.error("Failed to delete quiz:", error);
        toast.error("Failed to delete quiz.");
      }
    }
  };

  const handleSettingsSubmit = async (quizId, settings) => {
    try {
      await updateQuizSettings(quizId, settings);
      toast.success("Quiz settings updated successfully!");
      setSettingsQuizId(null);
      loadPendingQuizzes();
    } catch (error) {
      console.error("Failed to update quiz settings:", error);
      toast.error("Failed to update quiz settings.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Pending Quizzes
      </h1>

      {settingsQuizId ? (
        <div className="mb-6 w-full max-w-3xl mx-auto">
          <QuizSettingsComp
            quizId={settingsQuizId}
            onSubmit={(settings) => handleSettingsSubmit(settingsQuizId, settings)}
          />
          <button
            onClick={() => setSettingsQuizId(null)}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full sm:w-auto"
          >
            🔙 Back to Quizzes
          </button>
        </div>
      ) : (
        <ul className="space-y-4 w-full max-w-4xl mx-auto">
          {pendingQuizzes.length > 0 ? (
            pendingQuizzes.map((quiz) => (
              <PendingQuizItem
                key={quiz._id}
                quiz={quiz}
                isEditing={editingQuiz === quiz._id}
                formData={formData}
                onInputChange={handleInputChange}
                onUpdateQuiz={handleUpdateQuiz}
                onCancelEdit={() => setEditingQuiz(null)}
                onPublishQuiz={handlePublishQuiz}
                onStartQuiz={handleStartQuiz}
                onEndQuiz={handleEndQuiz}
                onAddQuestions={handleAddQuestions}
                onEditQuiz={handleEditQuiz}
                onSetSettings={setSettingsQuizId}
                onDeleteQuiz={handleDeleteQuiz}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No pending quizzes found.</p>
          )}
        </ul>
      )}
    </div>
  );
}