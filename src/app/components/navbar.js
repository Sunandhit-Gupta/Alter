"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaUser, FaBars, FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role || "student"; // Default to "student"
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (status === "loading") return <div className="text-center my-5">Loading...</div>;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = userRole === "student"
    ? [
        { href: "/pages/student/history", label: "History" },
        { href: "/pages/student/upcomingQuizes", label: "Upcoming Quizzes" },
        { href: "/pages/student/ongoingQuizes", label: "Ongoing Quizzes" },
      ]
    : [
        { href: "/pages/history", label: "History" },
        { href: "/pages/createQuiz", label: "Create Quiz" },
        { href: "/pages/pendingQuiz", label: "Pending Quiz" },
      ];

  const linkStyles = "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 rounded-md p-2 text-gray-800 dark:text-white";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="group flex items-center font-bold text-3xl font-sans">
          <span className="text-[#4A90E2] group-hover:text-[#FF6F61]">Quiz</span>
          <span className="text-[#FF6F61] ml-1 group-hover:text-[#4A90E2]">Mate</span>
        </div>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <div key={index} className={linkStyles}>
              <Link href={item.href}>{item.label}</Link>
            </div>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <FaMoon className="text-white" /> : <FaSun className="text-gray-800" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
              aria-label="Profile Menu"
            >
              <FaUser className="text-gray-800 dark:text-white" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                <Link
                  href="/pages/profile"
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <FaUser className="mr-2" /> Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu for smaller screens */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
            aria-label="Toggle Menu"
          >
            <FaBars className="text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {navItems.map((item, index) => (
            <div key={index} className={linkStyles}>
              <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}