"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import LoadingSkeleton from "../../../components/LoadingSkeleton";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/user/profile?email=${session.user.email}`);
          if (response.data.success) {
            // Verify that the user is a student
            if (response.data.user.role !== "student") {
              window.location.href = "/"; // Redirect if not a student
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

  const userName = userData?.name || "Student";

  return (
    <div className="container mx-auto p-6 py-8">
      {/* Student Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#4A90E2] mb-2 ">
        Welcome back, {userName}!
        </h1>
        {/* <p className="text-gray-600">Welcome back, {userName}!</p> */}
      </header>

      {/* Student Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">Ongoing Quizzes</h2>
          <p className="mt-2 text-gray-600">Jump into quizzes happening now.</p>
          <Link href="/pages/student/ongoingQuizes" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            Start Now
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">Upcoming Quizzes</h2>
          <p className="mt-2 text-gray-600">Get ready for what's next.</p>
          <Link href="/pages/student/upcomingQuizes" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            View Schedule
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-[#FF6F61]">History</h2>
          <p className="mt-2 text-gray-600">Review your past performance.</p>
          <Link href="/pages/student/history" className="mt-4 inline-block text-[#4A90E2] hover:underline font-medium">
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
}