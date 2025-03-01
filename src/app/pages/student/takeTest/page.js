"use client";

import FullscreenPrompt from "@/app/components/FullscreenPrompt";
import QuizQuestions from "@/app/components/QuizQuestions";
import QuizTimer from "@/app/components/QuizTimer";
import useCopyPasteBlocker from "@/app/hooks/useCopyPasteBlocker";
import useFullscreenManager from "@/app/hooks/useFullScreenManager";
import useQuizData from "@/app/hooks/useQuizData";
import useTabMonitor from "@/app/hooks/useTabMonitor";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TakeTestPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = searchParams.get("quizId");
  const hasSubmitted = useRef(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState({});
  const [quizInfo, setQuizInfo] = useState(null);
  const [totalMarks, setTotalMarks] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { isBlurred, handleGoFullscreen } = useFullscreenManager(isSubmitted);
  const { tabSwitchCount } = useTabMonitor(isSubmitted, () => handleSubmitQuiz());
  useCopyPasteBlocker();
  const { questions, error, loading, quizData } = useQuizData(quizId, isSubmitted, setResponses);

  useEffect(() => {
    if (quizData) {
      setQuizInfo(quizData);
    }
    if (questions && questions.length > 0) {
      const total = questions.reduce((sum, question) => sum + (question.points || 1), 0);
      setTotalMarks(total);
    }
  }, [quizData, questions]);

  const handleAnswerChange = (questionId, answer, questionType) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      if (questionType === "Subjective" || questionType === "Single Correct MCQ") {
        newResponses[questionId] = [answer];
      } else {
        const currentAnswers = [...(prev[questionId] || [])];
        const answerIndex = currentAnswers.indexOf(answer);
        if (answerIndex === -1) {
          currentAnswers.push(answer);
        } else {
          currentAnswers.splice(answerIndex, 1);
        }
        newResponses[questionId] = currentAnswers;
      }
      return newResponses;
    });
  };

  async function handleSubmitQuiz() {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setIsSubmitted(true);
    setIsSubmitting(true);

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
        hasSubmitted.current = false;
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error("Error submitting the quiz.");
      hasSubmitted.current = false;
      setIsSubmitting(false);
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleTimerEnd = useCallback(() => {
    toast.info("Time's up! Submitting your quiz automatically.");
    handleSubmitQuiz();
  }, [handleSubmitQuiz]);

  if (loading) {
    return <div className="text-center p-8">Loading quiz questions...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }
  console.log("working:", quizInfo);

  // Determine whether to show single question or all questions
  const displayQuestions = quizInfo?.showSingleQuestion
    ? [questions[currentQuestionIndex]]
    : questions;

  return (
    <>
      {isBlurred && <FullscreenPrompt onGoFullscreen={handleGoFullscreen} />}

      <div className={`p-6 min-h-screen ${isBlurred ? "filter blur-lg pointer-events-none" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            📝 {quizInfo?.quizTitle || "Take Test"}
          </h1>

          <div className="text-lg font-semibold">
            Total Marks: <span className="text-green-600">{totalMarks}</span>
          </div>

          {quizInfo?.duration && (
            <QuizTimer
              duration={quizInfo.duration}
              onTimerEnd={handleTimerEnd}
              isSubmitted={isSubmitted}
            />
          )}
        </div>

        {quizInfo?.shuffleQuestions && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md">
            Note: Questions and options are randomly shuffled for this test.
          </div>
        )}

        <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
          <QuizQuestions
            questions={displayQuestions}
            responses={responses}
            onAnswerChange={handleAnswerChange}
          />

          {/* Navigation buttons only when showSingleQuestion is true */}
          {quizInfo?.showSingleQuestion && (
            <div className="mt-4 flex justify-end">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Next ➡️
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                  disabled={isSubmitted}
                >
                  {isSubmitting ? "Submitting..." : "📤 Submit Quiz"}
                </button>
              )}
            </div>
          )}

          {/* Submit button when showSingleQuestion is false */}
          {!quizInfo?.showSingleQuestion && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                disabled={isSubmitted}
              >
                {isSubmitting ? "Submitting..." : "📤 Submit Quiz"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}