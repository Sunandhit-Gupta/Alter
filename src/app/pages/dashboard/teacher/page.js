"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import LoadingSkeleton from "../../../components/LoadingSkeleton";

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/user/profile?email=${session.user.email}`);
          if (response.data.success) {
            // Verify that the user is a teacher
            if (response.data.user.role !== "teacher") {
              window.location.href = "/"; // Redirect if not a teacher
              return;
            }
            setUserData(response.data.user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [session]);

  if (status === "loading" || loading) {
    return <LoadingSkeleton />;
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-4">You don't have permission to view this page.</p>
        <Link href="/" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
          Return to Home
        </Link>
      </div>
    );
  }

  const userName = userData?.name || "Teacher";

  return (
    <div className="container mx-auto p-4">
      {/* Teacher Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#4A90E2] mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, {userName}!</p>
      </header>

      {/* Teacher Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">Create Quiz</h2>
          <p className="mt-2 text-gray-600">Design a new quiz for students.</p>
          <Link href="/pages/createQuiz" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            Create Now
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">Pending Quizzes</h2>
          <p className="mt-2 text-gray-600">Review quizzes awaiting approval.</p>
          <Link href="/pages/pendingQuiz" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            Manage Now
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">History</h2>
          <p className="mt-2 text-gray-600">See past quiz activity.</p>
          <Link href="/pages/history" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            View History
          </Link>
        </div>
      </div>

      {/* Additional Teacher Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">Student Performance</h2>
          <p className="mt-2 text-gray-600">Track how your students are doing.</p>
          <Link href="/pages/teacher/studentPerformance" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            View Analytics
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">Resource Library</h2>
          <p className="mt-2 text-gray-600">Manage and upload study materials.</p>
          <Link href="/pages/teacher/resources" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            Manage Resources
          </Link>
        </div>
      </div>
    </div>
  );
}