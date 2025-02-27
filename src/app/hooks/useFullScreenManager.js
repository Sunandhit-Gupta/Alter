import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useFullscreenManager(isSubmitted) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmitted) {
        toast.warning("Warning: You exited fullscreen! Click the button to re-enter.");
        setIsBlurred(true);
      }
    };

    enterFullscreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isSubmitted]);

  const handleGoFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsBlurred(false);
  };

  return { isBlurred, handleGoFullscreen };
}