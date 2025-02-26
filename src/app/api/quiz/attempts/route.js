import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET: Fetch students who attempted a specific quiz
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
        return NextResponse.json({ message: "Quiz ID is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // 🔍 Find students who attempted the quiz
        const responses = await StudentResponse.find({ quizId }).lean();

        // Fetch student details
        const studentDetails = await Promise.all(
            responses.map(async (response) => {
                const student = await User.findById(response.studentId).lean();
                return {
                    name: student?.name || "Unknown",
                    rollNumber: student?.rollNumber || "N/A",
                    email: student?.email || "N/A",
                    totalScore: response.totalFinalScore,
                    totalAutoScore: response.totalAutoScore,
                    attemptTime: response.submittedAt,
                    studentId : response.studentId
                };
            })
        );
        return NextResponse.json(studentDetails);
    } catch (error) {
        console.error("❌ Failed to fetch student attempts:", error);
        return NextResponse.json({ message: "Failed to fetch student attempts.", error }, { status: 500 });
    }
}