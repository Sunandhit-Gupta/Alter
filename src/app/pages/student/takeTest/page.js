"use client";

// import FullscreenPrompt from "@/app/components/FullScreenPrompt";
import QuizQuestions from "@/app/components/QuizQuestions";
import QuizTimer from "@/app/components/QuizTimer";
import useCopyPasteBlocker from "@/app/hooks/useCopyPasteBlocker";
// import useFullscreenManager from "@/app/hooks/useFullscreenManager";
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

  // Custom hooks
  const { isBlurred, handleGoFullscreen } = useFullscreenManager(isSubmitted);
  const { tabSwitchCount } = useTabMonitor(isSubmitted, () => handleSubmitQuiz());
  useCopyPasteBlocker();
  const { questions, error, loading, quizData } = useQuizData(quizId, isSubmitted, setResponses);

  // Set quiz info when data is loaded
  useEffect(() => {
    if (quizData) {
      setQuizInfo(quizData);
    }
  }, [quizData]);

  // Handle answer changes
  const handleAnswerChange = (questionId, answer, questionType) => {
    setResponses(prev => {
      const newResponses = { ...prev };

      if (questionType === "Subjective") {
        newResponses[questionId] = [answer];
      } else if (questionType === "Single Correct MCQ") {
        newResponses[questionId] = [answer];
      } else {
        // Multiple Correct MCQ
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

  // Submit quiz
  async function handleSubmitQuiz() {
    if (hasSubmitted.current) return;  // Prevent multiple submissions
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
        // Allow resubmission if it failed
        hasSubmitted.current = false;
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error("Error submitting the quiz.");
      // Allow resubmission if an error occurs
      hasSubmitted.current = false;
      setIsSubmitting(false);
    }
  }

  // Memoize the timer end handler to prevent unnecessary re-renders
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

  return (
    <>
      {isBlurred && <FullscreenPrompt onGoFullscreen={handleGoFullscreen} />}

      <div className={`p-6 min-h-screen ${isBlurred ? "filter blur-lg pointer-events-none" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            📝 {quizInfo?.quizTitle || 'Take Test'}
          </h1>

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
            questions={questions}
            responses={responses}
            onAnswerChange={handleAnswerChange}
          />

          <button
            onClick={handleSubmitQuiz}
            className="w-full mt-4 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 flex items-center justify-center"
            disabled={isSubmitted}
          >
            {isSubmitting ? (
              // Loading animation (spinner + text)
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Submitting...</span>
              </div>
            ) : (
              "📤 Submit Quiz"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
