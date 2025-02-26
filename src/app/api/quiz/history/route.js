import Quiz from "@/app/models/quiz";
import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET: Fetch teacher's quiz history (only Completed quizzes)
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const teacherEmail = searchParams.get("email");

    if (!teacherEmail) {
        return NextResponse.json({ message: "Teacher email is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // 🔍 Find teacher by email
        const teacher = await User.findOne({ email: teacherEmail });
        if (!teacher) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // ✅ Fetch only "Completed" quizzes created by the teacher
        const completedQuizzes = await Quiz.find({ createdBy: teacher._id, status: "Completed" })
            .sort({ createdAt: -1 }) // Sort by latest first
            .lean();

        // 📊 Fetch student responses for each quiz
        const quizHistory = await Promise.all(
            completedQuizzes.map(async (quiz) => {
                // 🔍 Count students who actually attempted the quiz
                const attemptedStudents = await StudentResponse.find({ quizId: quiz._id });

                // 🏆 Calculate average final score only for those who attempted
                let avgFinalScore = "N/A";
                if (attemptedStudents.length > 0) {
                    const totalScore = attemptedStudents.reduce((sum, entry) => sum + entry.totalFinalScore, 0);
                    avgFinalScore = (totalScore / attemptedStudents.length).toFixed(2);
                }

                return {
                    _id: quiz._id,
                    quizTitle: quiz.quizTitle,
                    courseCode: quiz.courseCode,
                    rollRange: quiz.rollRange,
                    studentCount: attemptedStudents.length, // Only count students who attempted
                    avgFinalScore,
                    createdAt: quiz.createdAt,
                    status: "Completed"
                };
            })
        );

        return NextResponse.json(quizHistory);
    } catch (error) {
        console.error("❌ Failed to fetch teacher quiz history:", error);
        return NextResponse.json({ message: "Failed to fetch history.", error }, { status: 500 });
    }
}