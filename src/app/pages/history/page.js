"use client";
import { useEffect, useState } from "react";
import DesktopTeacherHistory from "../desktopView/teacher/page";
import MobileTeacherHistory from "../mobileView/teacher/page";

export default function TeacherQuizHistory() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 770); // Tailwind's `sm` breakpoint is 640px
        };

        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile ? <MobileTeacherHistory /> : <DesktopTeacherHistory />;
}