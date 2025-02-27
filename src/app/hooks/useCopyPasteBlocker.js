import { useEffect } from "react";

export default function useCopyPasteBlocker() {
  useEffect(() => {
    const preventActions = (e) => e.preventDefault();

    // Block copy, paste, right-click, and text selection
    document.addEventListener("copy", preventActions);
    document.addEventListener("paste", preventActions);
    document.addEventListener("contextmenu", preventActions);
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("copy", preventActions);
      document.removeEventListener("paste", preventActions);
      document.removeEventListener("contextmenu", preventActions);
      document.body.style.userSelect = "auto";
    };
  }, []);
}