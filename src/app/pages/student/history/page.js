"use client";
import { useEffect, useState } from "react";
import DesktopStudentHistory from "../../desktopView/student/page";
import MobileStudentHistory from "../../mobileView/student/page";

export default function StudentQuizHistory() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 770); // Tailwind's `sm` breakpoint is 640px
        };

        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile ? <MobileStudentHistory /> : <DesktopStudentHistory />;
}