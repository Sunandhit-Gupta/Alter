"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/user/profile?email=${session.user.email}`);
          if (response.data.success) {
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

  // Skeleton Component
  const SkeletonCard = () => (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
      <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
    </div>
  );

  const SkeletonHeader = () => (
    <div className="h-8 w-1/3 bg-gray-300 rounded mb-6 animate-pulse"></div>
  );

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto p-4">
        <SkeletonHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const userRole = userData?.role || "student";
  const userName = userData?.name || "User"; // Name from API

  return (
    <div className="container mx-auto p-4">
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold text-[#4A90E2] mb-6">
        Welcome, {userName}!
      </h1>

      {/* Dashboard Content */}
      {userRole === "student" ? (
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
            <p className="mt-2 text-gray-600">Get ready for what’s next.</p>
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
      ) : (
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
      )}
    </div>
  );
}
