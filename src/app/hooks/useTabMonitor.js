import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useTabMonitor(isSubmitted, handleSubmitQuiz) {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Monitor tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isSubmitted && document.hidden) {
        toast.warning("Warning: You switched tabs! Avoid switching tabs to prevent auto-submission.");
        setTabSwitchCount((prev) => prev + 1);
      }
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Your quiz will be submitted.";
    };

    if (!isSubmitted) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted]);

  // Auto-submit after 3 tab switches
  useEffect(() => {
    console.log("Attempting to submit quiz. isSubmitted:", isSubmitted);

    if (!isSubmitted && tabSwitchCount >= 3) {
      toast.error("You switched tabs too many times! Your quiz is being auto-submitted.");
      handleSubmitQuiz();
    }
  }, [tabSwitchCount, isSubmitted, handleSubmitQuiz]);

  return { tabSwitchCount, setTabSwitchCount };
}