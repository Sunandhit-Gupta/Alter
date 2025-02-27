"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import LoadingSkeleton from "./components/LoadingSkeleton";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/profile?email=${session.user.email}`);
          if (response.data.success) {
            const role = response.data.user.role;
            if (role === "student") {
              router.push("/pages/dashboard/student");
            } else if (role === "teacher") {
              router.push("/pages/dashboard/teacher");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else if (status === "unauthenticated") {
      setLoading(false);
      router.push("/");

    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return <LoadingSkeleton />;
  }

  // Public Landing Page for Unauthenticated Users
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="group flex items-center font-bold text-3xl font-sans">
            <span className="text-[#4A90E2] group-hover:text-[#FF6F61]">Quiz</span>
            <span className="text-[#FF6F61] ml-1 group-hover:text-[#4A90E2]">Mate</span>
          </Link>
            <Link 
              href="/auth/login"
              className="bg-[#4A90E2] hover:bg-blue-600 text-white py-2 px-6 rounded-md transition"
            >
              Log In
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Learn and Test Your Knowledge
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join our interactive quiz platform designed for students and teachers.
                Create, participate, and track your progress all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="auth/register"
                  className="bg-[#FF6F61] hover:bg-red-500 text-white py-3 px-8 rounded-md font-semibold transition"
                >
                  Get Started
                </Link>
                <Link 
                  href="/about" 
                  className="border border-gray-300 text-gray-700 py-3 px-8 rounded-md font-semibold hover:bg-gray-50 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="bg-blue-50 p-6 rounded-md mb-6">
                  <h3 className="text-xl font-semibold text-[#4A90E2] mb-2">For Students</h3>
                  <p className="text-gray-600">
                    Participate in quizzes, track performance, and access learning resources.
                  </p>
                </div>
                <div className="bg-red-50 p-6 rounded-md">
                  <h3 className="text-xl font-semibold text-[#FF6F61] mb-2">For Teachers</h3>
                  <p className="text-gray-600">
                    Create and manage quizzes, monitor student progress, and organize resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section className="bg-gray-50 py-12 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Interactive Quizzes"
                description="Engaging quizzes with various question types to test and improve your knowledge."
              />
              <FeatureCard 
                title="Performance Tracking"
                description="Detailed statistics and analytics to monitor your progress."
              />
              <FeatureCard 
                title="Resource Library"
                description="Access learning materials and study resources to help you prepare."
              />
            </div>
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="container mx-auto px-4 py-12 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of learners and educators. Sign in to access all features.
          </p>
          <Link 
            href="auth/register"
            className="bg-[#4A90E2] hover:bg-blue-600 text-white py-3 px-8 rounded-md font-semibold transition"
          >
            Sign In Now
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold">QuizMate</h2>
                <p className="text-gray-400 mt-2">© 2025 All Rights Reserved</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  About
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contact
                </Link>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-[#4A90E2] mb-6">Welcome to QuizMate</h1>
      <p className="text-gray-600">Redirecting to your dashboard...</p>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}