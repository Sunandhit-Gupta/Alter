"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
    Book, 
    Users, 
    Award, 
    Calendar, 
    ChevronRight, 
    FileText, 
    AlertTriangle,
    Search,
    ArrowUpDown 
} from "lucide-react";
export default function DesktopTeacherHistory() {
    const { data: session } = useSession();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const router = useRouter();

    useEffect(() => {
        const fetchTeacherHistory = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await axios.get(`/api/quiz/history?email=${session.user.email}`);
                setQuizzes(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch teacher quiz history:", err);
                setError("⚠️ Failed to load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherHistory();
    }, [session]);

    // Sorting function
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sorted and filtered quizzes with safe property access
    const getSortedQuizzes = () => {
        const filteredQuizzes = quizzes.filter(quiz => {
            const quizTitle = quiz.quizTitle ?? "";
            const courseCode = quiz.courseCode ?? "";
            const batch = quiz.batch ?? "";
            
            return (
                quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                batch.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        
        return [...filteredQuizzes].sort((a, b) => {
            const aValue = a[sortConfig.key] ?? "";
            const bValue = b[sortConfig.key] ?? "";
            
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Format date for better display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Calculate total students and average scores across all quizzes
    const totalStudents = quizzes.reduce((sum, quiz) => sum + (quiz.studentCount || 0), 0);
    const avgAllQuizzes = quizzes.length > 0 
        ? (quizzes.reduce((sum, quiz) => sum + (quiz.avgFinalScore || 0), 0) / quizzes.length).toFixed(1)
        : 0;

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="p-6 animate-pulse">
            <div className="h-8 w-56 bg-gray-300 rounded mb-4"></div>
            <div className="h-5 w-96 bg-gray-200 rounded mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
            
            <div className="h-12 w-full bg-gray-200 rounded mb-6"></div>
            
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-48 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
        </div>
    );

    // Error display component
    const ErrorDisplay = () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 text-center max-w-md">
                <AlertTriangle className="h-12 w-12 text-[#FF6F61] mx-auto mb-4" />
                <p className="text-red-600 text-lg font-medium">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#FF6F61] text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorDisplay />;

    const sortedQuizzes = getSortedQuizzes();

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2 text-[#4A90E2] tracking-tight">
                        Quiz Management Dashboard
                    </h1>
                    <p className="text-gray-600">Track quiz performance, review student participation, and analyze results all in one place.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#4A90E2] rounded-xl shadow-md p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-white/80 mb-1">Total Quizzes</p>
                                <p className="text-2xl font-bold">{quizzes.length}</p>
                            </div>
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    
                    <div className="bg-[#FF6F61] rounded-xl shadow-md p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-white/80 mb-1">Total Students</p>
                                <p className="text-2xl font-bold">{totalStudents}</p>
                            </div>
                            <Users className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    
                    <div className="bg-red-500 rounded-xl shadow-md p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-white/80 mb-1">Average Score</p>
                                <p className="text-2xl font-bold">{avgAllQuizzes}%</p>
                            </div>
                            <Award className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Search and Sort Controls */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by title, course code or batch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent text-gray-800 placeholder-gray-600"
                            />
                            <Search className="h-5 w-5 text-gray-600 absolute left-3 top-2.5" />
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => requestSort('createdAt')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                                    sortConfig.key === 'createdAt' 
                                        ? 'bg-[#4A90E2]/10 text-[#4A90E2]' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-[#4A90E2]/20'
                                }`}
                            >
                                <Calendar className="h-4 w-4 mr-1 text-[#4A90E2]" />
                                Date
                                <ArrowUpDown className="h-3 w-3 ml-1 text-[#4A90E2]" />
                            </button>
                            
                            <button 
                                onClick={() => requestSort('studentCount')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                                    sortConfig.key === 'studentCount' 
                                        ? 'bg-[#FF6F61]/10 text-[#FF6F61]' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-[#FF6F61]/20'
                                }`}
                            >
                                <Users className="h-4 w-4 mr-1 text-[#FF6F61]" />
                                Students
                                <ArrowUpDown className="h-3 w-3 ml-1 text-[#FF6F61]" />
                            </button>
                            
                            <button 
                                onClick={() => requestSort('avgFinalScore')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                                    sortConfig.key === 'avgFinalScore' 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-red-200'
                                }`}
                            >
                                <Award className="h-4 w-4 mr-1 text-red-500" />
                                Score
                                <ArrowUpDown className="h-3 w-3 ml-1 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quiz Cards */}
                {sortedQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {sortedQuizzes.map((quiz) => (
                            <div 
                                key={quiz._id} 
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                                📝 {quiz.quizTitle}
                                            </h2>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Calendar className="h-4 w-4 mr-1 text-gray-600" />
                                                {formatDate(quiz.createdAt)}
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => router.push(`/pages/quiz/attempts/${quiz._id}`)}
                                            className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                                        >
                                            View Details
                                            <ChevronRight className="h-4 w-4 ml-1 text-white" />
                                        </button>
                                    </div>
                                    
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Course Info */}
                                        <div className="flex items-start space-x-3">
                                            <div className="rounded-full bg-[#4A90E2]/10 p-2 flex-shrink-0">
                                                <Book className="h-5 w-5 text-[#4A90E2]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Course Code</p>
                                                <p className="font-medium text-gray-800">{quiz.courseCode}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Batch Info */}
                                        <div className="flex items-start space-x-3">
                                            <div className="rounded-full bg-[#FF6F61]/10 p-2 flex-shrink-0">
                                                {/* Corrected: Replaced GraduationCap with Users */}
                                                <Users className="h-5 w-5 text-[#FF6F61]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Batch</p>
                                                <p className="font-medium text-gray-800">{quiz.batch}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Students Info */}
                                        <div className="flex items-start space-x-3">
                                            <div className="rounded-full bg-red-100/10 p-2 flex-shrink-0">
                                                <Users className="h-5 w-5 text-[#FF6F61]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Students Attempted</p>
                                                <p className="font-medium text-gray-800">{quiz.studentCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar Section */}
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-1">
                                            <p className="text-sm text-gray-600">Average Final Score</p>
                                            <p className="text-sm font-medium text-gray-800">{quiz.avgFinalScore}%</p>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#4A90E2]" 
                                                style={{ width: `${quiz.avgFinalScore}%` }}
                                            ></div>
                                        </div>
                                        
                                        <div className="flex justify-between mt-3 mb-1">
                                            <p className="text-sm text-gray-600">Average Auto Score</p>
                                            <p className="text-sm font-medium text-gray-800">{quiz.avgAutoFinalScore}%</p>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#4A90E2]" 
                                                style={{ width: `${quiz.avgAutoFinalScore}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No quizzes found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? "No quizzes match your search criteria." : "You haven't created any quizzes yet."}
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
            </div>
        </div>
    );
}