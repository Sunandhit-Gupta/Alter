"use client";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Award, AlertTriangle } from "lucide-react";

export default function DesktopStudentHistory() {
    const { data: session } = useSession();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("attempted");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await axios.get(`/api/quiz/student/history?email=${session.user.email}`);
                const sortedHistory = res.data.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
                setHistory(sortedHistory);
            } catch (err) {
                console.error("❌ Failed to fetch quiz history:", err);
                setError("⚠️ Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [session]);

    // Separate and filter quizzes
    const filteredHistory = history.filter(entry => 
        entry.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const attemptedQuizzes = filteredHistory.filter((entry) => entry.status === "Attempted");
    const missedQuizzes = filteredHistory.filter((entry) => entry.status === "Missed");

    // Format date for better display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="p-6 animate-pulse">
            <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
            <div className="flex space-x-4 mb-6">
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-12 bg-gray-300 rounded"></div>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-md">
                <div className="min-w-full bg-white border border-gray-200">
                    <div className="h-14 bg-gray-300"></div>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-16 bg-gray-200 mt-1"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) return <SkeletonLoader />;
    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 text-lg font-medium">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Stats cards
    const StatCard = ({ title, value, icon, bgColor }) => (
        <div className={`${bgColor} rounded-xl shadow-md p-4 flex items-center`}>
            <div className="rounded-full bg-white/20 p-3 mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-white/80">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2 text-[#4A90E2] tracking-tight">
                        Quiz History
                    </h1>
                    <p className="text-gray-600">Track your quiz performance and submissions over time</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        title="Total Quizzes" 
                        value={history.length} 
                        icon={<BookOpen className="h-6 w-6 text-white" />}
                        bgColor="bg-[#4A90E2]"
                    />
                    <StatCard 
                        title="Attempted" 
                        value={attemptedQuizzes.length} 
                        icon={<Award className="h-6 w-6 text-white" />}
                        bgColor="bg-[#FF6F61]"
                    />
                    <StatCard 
                        title="Missed" 
                        value={missedQuizzes.length} 
                        icon={<AlertTriangle className="h-6 w-6 text-white" />}
                        bgColor="bg-red-500"
                    />
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab("attempted")}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-300 flex items-center ${
                                activeTab === "attempted"
                                    ? "bg-[#4A90E2] shadow-md"
                                    : "bg-gray-400 hover:bg-[#4A90E2]"
                            }`}
                        >
                            <Award className="h-4 w-4 mr-2 text-white" />
                            Attempted Quizzes
                        </button>
                        <button
                            onClick={() => setActiveTab("missed")}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-300 flex items-center ${
                                activeTab === "missed" 
                                    ? "bg-[#FF6F61] shadow-md" 
                                    : "bg-gray-400 hover:bg-[#FF6F61]"
                            }`}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2 text-white" />
                            Missed Quizzes
                        </button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent text-gray-800 placeholder-gray-600"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Empty state */}
                {filteredHistory.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No quizzes found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? "No quizzes match your search criteria." : "You haven't participated in any quizzes yet."}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}

                {/* Table Content Based on Active Tab */}
                {filteredHistory.length > 0 && (
                    <div className="overflow-hidden rounded-xl shadow-md bg-white">
                        {activeTab === "attempted" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-[#4A90E2] text-white">
                                            <th className="py-4 px-6 text-left font-semibold">Quiz Title</th>
                                            <th className="py-4 px-6 text-left font-semibold">Roll Number</th>
                                            <th className="py-4 px-6 text-left font-semibold">Score</th>
                                            <th className="py-4 px-6 text-left font-semibold">Submitted</th>
                                            <th className="py-4 px-6 text-left font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attemptedQuizzes.length > 0 ? (
                                            attemptedQuizzes.map((entry, index) => (
                                                <tr
                                                    key={entry._id}
                                                    className={`border-t ${
                                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                    } hover:bg-[#F0F7FF] transition-colors duration-200`}
                                                >
                                                    <td className="py-4 px-6 font-medium text-gray-800">{entry.quizTitle}</td>
                                                    <td className="py-4 px-6 text-gray-600">{entry.rollNumber}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <span className="text-gray-700 font-medium text-center">{entry.totalAutoScore}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600">
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 text-gray-600 mr-2" />
                                                            {formatDate(entry.submittedAt)}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <Link
                                                            href={`/pages/quiz/student/${entry.quizId}/${entry.id}`}
                                                            className="inline-flex items-center px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-md hover:bg-[#4A90E2]/20 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <Award className="h-8 w-8 text-gray-300 mb-2" />
                                                        <p>No attempted quizzes yet.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "missed" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-[#FF6F61] text-white">
                                            <th className="py-4 px-6 text-left font-semibold">Quiz Title</th>
                                            <th className="py-4 px-6 text-left font-semibold">Roll Number</th>
                                            <th className="py-4 px-6 text-left font-semibold">Status</th>
                                            <th className="py-4 px-6 text-left font-semibold">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {missedQuizzes.length > 0 ? (
                                            missedQuizzes.map((entry, index) => (
                                                <tr
                                                    key={entry.quizId}
                                                    className={`border-t ${
                                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                    } hover:bg-[#FFE5E5] transition-colors duration-200`}
                                                >
                                                    <td className="py-4 px-6 font-medium text-gray-800">{entry.quizTitle}</td>
                                                    <td className="py-4 px-6 text-gray-600">{entry.rollNumber}</td>
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <AlertTriangle className="h-3 w-3 mr-1 text-[#FF6F61]" />
                                                            Missed
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                                                            {formatDate(entry.createdTime)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p>No missed quizzes. Great job!</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}