"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import { FaUserGraduate, FaIdBadge, FaEnvelope, FaTrophy, FaClock } from "react-icons/fa";

export default function TeacherQuizDetails() {
    const { quizId } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudentAttempts = async () => {
            try {
                const res = await axios.get(`/api/quiz/attempts?quizId=${quizId}`);
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch student attempts:", err);
                setError("Failed to load student attempts.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudentAttempts();
    }, [quizId]);

    const SkeletonLoader = () => (
        <div className="p-6 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-80 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="h-4 w-36 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold mb-4 text-[#4A90E2] tracking-tight">
                Quiz Attempt Details
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
                A detailed list of students who have taken this quiz.
            </p>

            {loading ? (
                <SkeletonLoader />
            ) : error ? (
                <p className="text-red-600 text-center font-semibold text-lg">{error}</p>
            ) : students.length > 0 ? (
                <div className="space-y-6">
                    {students.map((student, index) => (
                        <div
                            key={index}
                            className="p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-bold text-[#FF6F61] flex items-center gap-2 mb-3">
                                <FaUserGraduate /> {student.name}
                            </h3>
                            <p className="text-gray-700 flex items-center gap-2 mb-2">
                                <FaIdBadge className="text-gray-500" />
                                <span className="font-semibold text-gray-800">Roll Number:</span>{" "}
                                <span className="text-gray-600">{student.rollNumber}</span>
                            </p>
                            <p className="text-gray-700 flex items-center gap-2 mb-2 truncate">
                                <FaEnvelope className="text-gray-500" />
                                <span className="font-semibold text-gray-800">Email:</span>{" "}
                                <span className="text-gray-600">{student.email}</span>
                            </p>
                            <p className="text-gray-700 flex items-center gap-2 mb-2">
                                <FaTrophy className="text-yellow-500" />
                                <span className="font-semibold text-gray-800">Score:</span>{" "}
                                <span className="text-green-600 font-medium">{student.totalScore}</span>
                            </p>
                            <p className="text-gray-700 flex items-center gap-2 mb-4">
                                <FaClock className="text-gray-500" />
                                <span className="font-semibold text-gray-800">Attempt Time:</span>{" "}
                                <span className="text-gray-600">
                                    {new Date(student.attemptTime).toLocaleString()}
                                </span>
                            </p>
                            {/* Link to new page */}
                            <Link
                            // /pages/quiz/attempts/${quiz._id}
                                href={`/pages/quiz/student/${quizId}/${student.studentId}`} // Assuming studentId is available
                                className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#357ABD] inline-block"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center py-4 text-lg font-medium">
                    No students have attempted this quiz yet.
                </p>
            )}
        </div>
    );
}