// "use client";

// import FullscreenPrompt from "@/app/components/FullscreenPrompt";
// import QuizQuestions from "@/app/components/QuizQuestions";
// import QuizTimer from "@/app/components/QuizTimer";
// import useCopyPasteBlocker from "@/app/hooks/useCopyPasteBlocker";
// import useFullscreenManager from "@/app/hooks/useFullScreenManager";
// import useQuizData from "@/app/hooks/useQuizData";
// import useTabMonitor from "@/app/hooks/useTabMonitor";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function TakeTestPage() {
//   const { data: session } = useSession();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const quizId = searchParams.get("quizId");
//   const hasSubmitted = useRef(false);

//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [responses, setResponses] = useState({});
//   const [quizInfo, setQuizInfo] = useState(null);
//   const [totalMarks, setTotalMarks] = useState(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeOutOfFocus, setTimeOutOfFocus] = useState(0);
//   const [currentOutOfFocusTime, setCurrentOutOfFocusTime] = useState(0); // Time for current out-of-focus period
//   const [lastBlurTime, setLastBlurTime] = useState(null);
//   const MAX_OUT_OF_FOCUS_TIME = 20;

//   const { isBlurred, handleGoFullscreen } = useFullscreenManager(isSubmitted);
//   const { tabSwitchCount } = useTabMonitor(isSubmitted, () => handleSubmitQuiz());
//   useCopyPasteBlocker();
//   const { questions, error, loading, quizData } = useQuizData(quizId, isSubmitted, setResponses);

//   const [focusWarnings, setFocusWarnings] = useState(0);
//   const [pipWarningCount, setPipWarningCount] = useState(0);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     const handleBlur = () => {
//       if (!isSubmitted) {
//         setLastBlurTime(Date.now());
//         setFocusWarnings(prev => {
//           const newCount = prev + 1;
//           toast.error(`⚠️ Focus lost! Warning ${newCount}/3`);
//           return newCount;
//         });
//         // Start the real-time timer
//         timerRef.current = setInterval(() => {
//           setCurrentOutOfFocusTime(prev => prev + 0.1);
//         }, 100);
//       }
//     };

//     const handleFocus = () => {
//       if (!isSubmitted && lastBlurTime) {
//         clearInterval(timerRef.current);
//         const timeSpentOut = (Date.now() - lastBlurTime) / 1000;
//         setTimeOutOfFocus(prev => {
//           const newTotal = prev + timeSpentOut;
//           if (newTotal >= MAX_OUT_OF_FOCUS_TIME) {
//             toast.warning("Exceeded 20 seconds out of focus. Auto-submitting quiz.");
//             handleSubmitQuiz();
//           }
//           return newTotal;
//         });
//         setCurrentOutOfFocusTime(0); // Reset current timer
//         setLastBlurTime(null);
//         toast.info("You are back on the quiz!");
//       }
//     };

//     const handleMouseLeave = (event) => {
//       if (!isSubmitted && (event.clientY <= 0 || event.clientX <= 0 || event.clientX >= window.innerWidth)) {
//         if (!lastBlurTime) { // Only start if not already blurred
//           setLastBlurTime(Date.now());
//           setFocusWarnings(prev => {
//             const newCount = prev + 1;
//             toast.error(`⚠️ Cursor left the quiz! Warning ${newCount}/3`);
//             return newCount;
//           });
//           timerRef.current = setInterval(() => {
//             setCurrentOutOfFocusTime(prev => prev + 0.1);
//           }, 100);
//         }
//       }
//     };

//     const handleMouseEnter = () => {
//       if (!isSubmitted && lastBlurTime) {
//         clearInterval(timerRef.current);
//         const timeSpentOut = (Date.now() - lastBlurTime) / 1000;
//         setTimeOutOfFocus(prev => {
//           const newTotal = prev + timeSpentOut;
//           if (newTotal >= MAX_OUT_OF_FOCUS_TIME) {
//             toast.warning("Exceeded 20 seconds out of focus. Auto-submitting quiz.");
//             handleSubmitQuiz();
//           }
//           return newTotal;
//         });
//         setCurrentOutOfFocusTime(0);
//         setLastBlurTime(null);
//       }
//     };

//     window.addEventListener("blur", handleBlur);
//     window.addEventListener("focus", handleFocus);
//     window.addEventListener("mouseleave", handleMouseLeave);
//     window.addEventListener("mouseenter", handleMouseEnter);

//     return () => {
//       clearInterval(timerRef.current);
//       window.removeEventListener("blur", handleBlur);
//       window.removeEventListener("focus", handleFocus);
//       window.removeEventListener("mouseleave", handleMouseLeave);
//       window.removeEventListener("mouseenter", handleMouseEnter);
//     };
//   }, [isSubmitted, lastBlurTime]);
//   // Detect Picture-in-Picture Mode
//   useEffect(() => {
//     const handlePictureInPicture = () => {
//       setPipWarningCount(prev => prev + 1);

//       toast.error("⚠️ Picture-in-Picture mode is not allowed! Exiting now.");

//       if (document.pictureInPictureElement) {
//         document.exitPictureInPicture().catch(() => {});
//       }

//       if (pipWarningCount >= 1) { // Allow only 1 warning before auto-submitting
//         toast.warning("You tried PiP mode twice. Submitting your quiz.");
//         handleSubmitQuiz();
//       }
//     };

//     document.addEventListener("enterpictureinpicture", handlePictureInPicture);

//     return () => {
//       document.removeEventListener("enterpictureinpicture", handlePictureInPicture);
//     };
//   }, [pipWarningCount]);


//   useEffect(() => {
//     if (quizData) {
//       setQuizInfo(quizData);
//     }
//     if (questions && questions.length > 0) {
//       const total = questions.reduce((sum, question) => sum + (question.points || 1), 0);
//       setTotalMarks(total);
//     }
//   }, [quizData, questions]);

//   const handleAnswerChange = (questionId, answer, questionType) => {
//     setResponses(prev => {
//       const newResponses = { ...prev };
//       if (questionType === "Subjective" || questionType === "Single Correct MCQ") {
//         newResponses[questionId] = [answer];
//       } else {
//         const currentAnswers = [...(prev[questionId] || [])];
//         const answerIndex = currentAnswers.indexOf(answer);
//         if (answerIndex === -1) {
//           currentAnswers.push(answer);
//         } else {
//           currentAnswers.splice(answerIndex, 1);
//         }
//         newResponses[questionId] = currentAnswers;
//       }
//       return newResponses;
//     });
//   };

//   async function handleSubmitQuiz() {
//     if (hasSubmitted.current) return;
//     hasSubmitted.current = true;
//     setIsSubmitted(true);
//     setIsSubmitting(true);

//     try {
//       const res = await axios.post("/api/quiz/submitted", {
//         quizId,
//         responses,
//         studentEmail: session?.user?.email,
//       });

//       if (res.data.success) {
//         toast.success("Quiz submitted successfully!");
//         router.push("/pages/student/history");
//       } else {
//         toast.error(res.data.message || "Failed to submit quiz.");
//         hasSubmitted.current = false;
//         setIsSubmitting(false);
//       }
//     } catch (err) {
//       toast.error("Error submitting the quiz.");
//       hasSubmitted.current = false;
//       setIsSubmitting(false);
//     }
//   }

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handleTimerEnd = useCallback(() => {
//     toast.info("Time's up! Submitting your quiz automatically.");
//     handleSubmitQuiz();
//   }, [handleSubmitQuiz]);

//   if (loading) {
//     return <div className="text-center p-8">Loading quiz questions...</div>;
//   }

//   if (error) {
//     return <div className="text-center p-8 text-red-500">{error}</div>;
//   }
//   console.log("working:", quizInfo);

//   // Determine whether to show single question or all questions
//   const displayQuestions = quizInfo?.showSingleQuestion
//     ? [questions[currentQuestionIndex]]
//     : questions;

//     const timeLeft = Math.max(0, MAX_OUT_OF_FOCUS_TIME - timeOutOfFocus);

//   return (
//     <>
//       {isBlurred && <FullscreenPrompt onGoFullscreen={handleGoFullscreen} />}

//       <div className={`p-6 min-h-screen ${isBlurred ? "filter blur-lg pointer-events-none" : ""}`}>
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-blue-700">
//             📝 {quizInfo?.quizTitle || "Take Test"}
//           </h1>

//           <div className="text-lg font-semibold">
//             Total Marks: <span className="text-green-600">{totalMarks}</span>
//           </div>

//           <div className="text-lg font-semibold">
//             Time out of focus: Total: <span className="text-red-600">{timeOutOfFocus.toFixed(1)}s</span>
//             {lastBlurTime && <> | Current: <span className="text-red-600">{currentOutOfFocusTime.toFixed(1)}s</span></>}
//             {' '}Allowed: <span className="text-red-600">{timeLeft.toFixed(1)}s / {MAX_OUT_OF_FOCUS_TIME}s</span>
//           </div>

//           {quizInfo?.duration && (
//             <QuizTimer
//               duration={quizInfo.duration}
//               onTimerEnd={handleTimerEnd}
//               isSubmitted={isSubmitted}
//             />
//           )}
//         </div>

//         {quizInfo?.shuffleQuestions && (
//           <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md">
//             Note: Questions and options are randomly shuffled for this test.
//           </div>
//         )}

//         <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
//           <QuizQuestions
//             questions={displayQuestions}
//             responses={responses}
//             onAnswerChange={handleAnswerChange}
//           />

//           {/* Navigation buttons only when showSingleQuestion is true */}
//           {quizInfo?.showSingleQuestion && (
//             <div className="mt-4 flex justify-end">
//               {currentQuestionIndex < questions.length - 1 ? (
//                 <button
//                   onClick={handleNextQuestion}
//                   className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
//                 >
//                   Next ➡️
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubmitQuiz}
//                   className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
//                   disabled={isSubmitted}
//                 >
//                   {isSubmitting ? "Submitting..." : "📤 Submit Quiz"}
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Submit button when showSingleQuestion is false */}
//           {!quizInfo?.showSingleQuestion && (
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={handleSubmitQuiz}
//                 className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
//                 disabled={isSubmitted}
//               >
//                 {isSubmitting ? "Submitting..." : "📤 Submit Quiz"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

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
import { 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle 
} from "lucide-react";

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
  const [timeOutOfFocus, setTimeOutOfFocus] = useState(0);
  const [currentOutOfFocusTime, setCurrentOutOfFocusTime] = useState(0);
  const [lastBlurTime, setLastBlurTime] = useState(null);
  const MAX_OUT_OF_FOCUS_TIME = 20;

  const { isBlurred, handleGoFullscreen } = useFullscreenManager(isSubmitted);
  const { tabSwitchCount } = useTabMonitor(isSubmitted, () => handleSubmitQuiz());
  useCopyPasteBlocker();
  const { questions, error, loading, quizData } = useQuizData(quizId, isSubmitted, setResponses);

  const [focusWarnings, setFocusWarnings] = useState(0);
  const [pipWarningCount, setPipWarningCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleBlur = () => {
      if (!isSubmitted) {
        setLastBlurTime(Date.now());
        setFocusWarnings(prev => {
          const newCount = prev + 1;
          toast.error(`⚠️ Focus lost! Warning ${newCount}/3`);
          return newCount;
        });
        // Start the real-time timer
        timerRef.current = setInterval(() => {
          setCurrentOutOfFocusTime(prev => prev + 0.1);
        }, 100);
      }
    };

    const handleFocus = () => {
      if (!isSubmitted && lastBlurTime) {
        clearInterval(timerRef.current);
        const timeSpentOut = (Date.now() - lastBlurTime) / 1000;
        setTimeOutOfFocus(prev => {
          const newTotal = prev + timeSpentOut;
          if (newTotal >= MAX_OUT_OF_FOCUS_TIME) {
            toast.warning("Exceeded 20 seconds out of focus. Auto-submitting quiz.");
            handleSubmitQuiz();
          }
          return newTotal;
        });
        setCurrentOutOfFocusTime(0); // Reset current timer
        setLastBlurTime(null);
        toast.info("You are back on the quiz!");
      }
    };

    const handleMouseLeave = (event) => {
      if (!isSubmitted && (event.clientY <= 0 || event.clientX <= 0 || event.clientX >= window.innerWidth)) {
        if (!lastBlurTime) { // Only start if not already blurred
          setLastBlurTime(Date.now());
          setFocusWarnings(prev => {
            const newCount = prev + 1;
            toast.error(`⚠️ Cursor left the quiz! Warning ${newCount}/3`);
            return newCount;
          });
          timerRef.current = setInterval(() => {
            setCurrentOutOfFocusTime(prev => prev + 0.1);
          }, 100);
        }
      }
    };

    const handleMouseEnter = () => {
      if (!isSubmitted && lastBlurTime) {
        clearInterval(timerRef.current);
        const timeSpentOut = (Date.now() - lastBlurTime) / 1000;
        setTimeOutOfFocus(prev => {
          const newTotal = prev + timeSpentOut;
          if (newTotal >= MAX_OUT_OF_FOCUS_TIME) {
            toast.warning("Exceeded 20 seconds out of focus. Auto-submitting quiz.");
            handleSubmitQuiz();
          }
          return newTotal;
        });
        setCurrentOutOfFocusTime(0);
        setLastBlurTime(null);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isSubmitted, lastBlurTime]);
  // Detect Picture-in-Picture Mode
  useEffect(() => {
    const handlePictureInPicture = () => {
      setPipWarningCount(prev => prev + 1);

      toast.error("⚠️ Picture-in-Picture mode is not allowed! Exiting now.");

      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      }

      if (pipWarningCount >= 1) { // Allow only 1 warning before auto-submitting
        toast.warning("You tried PiP mode twice. Submitting your quiz.");
        handleSubmitQuiz();
      }
    };

    document.addEventListener("enterpictureinpicture", handlePictureInPicture);

    return () => {
      document.removeEventListener("enterpictureinpicture", handlePictureInPicture);
    };
  }, [pipWarningCount]);


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
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <BookOpen className="mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-xl text-gray-700">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg border-2 border-red-300">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-xl text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const timeLeft = Math.max(0, MAX_OUT_OF_FOCUS_TIME - timeOutOfFocus);

  return (
    <>
      {isBlurred && <FullscreenPrompt onGoFullscreen={handleGoFullscreen} />}

      <div className={`min-h-screen bg-gray-50 px-4 py-8 ${isBlurred ? "filter blur-lg pointer-events-none" : ""}`}>
        <div className="max-w-5xl mx-auto">
          {/* Header with Quiz Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
              <BookOpen className="text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {quizInfo?.quizTitle || "Take Test"}
                </h1>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
              <CheckCircle2 className="text-green-500" />
              <div>
                <span className="block text-sm text-gray-600">Total Marks</span>
                <span className="text-lg font-bold text-green-600">{totalMarks}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
              <AlertTriangle className="text-red-500" />
              <div>
                <span className="block text-sm text-gray-600">Focus Time Remaining</span>
                <span className="text-lg font-bold text-red-600">
                  {timeLeft.toFixed(1)}s / {MAX_OUT_OF_FOCUS_TIME}s
                </span>
              </div>
            </div>
          </div>

          {/* Timer and Quiz Controls */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            {quizInfo?.shuffleQuestions && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 text-yellow-800 rounded">
                Questions and options are randomly shuffled
              </div>
            )}

            {quizInfo?.duration && (
              <QuizTimer
                duration={quizInfo.duration}
                onTimerEnd={handleTimerEnd}
                isSubmitted={isSubmitted}
              />
            )}
          </div>

          {/* Quiz Questions Container */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <QuizQuestions
              questions={quizInfo?.showSingleQuestion ? [questions[currentQuestionIndex]] : questions}
              responses={responses}
              onAnswerChange={handleAnswerChange}
            />

            {/* Navigation and Submit Buttons */}
            <div className="mt-6 flex justify-end">
              {quizInfo?.showSingleQuestion ? (
                currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <span>Next</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitted}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                )
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitted}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}