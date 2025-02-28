import Quiz from "@/app/models/quiz";
import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET: Fetch student quiz history (attempted + missed)
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const studentEmail = searchParams.get("email");

    if (!studentEmail) {
        return NextResponse.json({ message: "Student email is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // 🔍 Find user by email
        const user = await User.findOne({ email: studentEmail }).lean();
        // console.log("User found:", user);

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // ✅ 1. Find all attempted quizzes (from StudentResponse)
        const history = await StudentResponse.find({ studentId: user._id }).populate("quizId").lean();
        // console.log("Attempted Quizzes:", history);

        const attemptedQuizIds = history.map((entry) => entry.quizId?._id.toString());
        // console.log("Attempted Quiz IDs:", attemptedQuizIds);

        const attemptedQuizzes = history.map((entry) => ({
            _id: entry._id,
            id: user._id,
            quizId: entry.quizId?._id || null,
            quizTitle: entry.quizId?.quizTitle || "Unknown Quiz",
            rollNumber: entry.rollNumber,
            totalAutoScore: entry.totalAutoScore || 0,
            totalFinalScore: entry.totalFinalScore || 0,
            submittedAt: entry.submittedAt,
            status: "Attempted"
        }));

        // ❌ 2. Fetch quizzes where user's roll number falls in the quiz's roll range
        const assignedQuizzes = await Quiz.find({
            status: "Completed",
            $expr: {
                $and: [
                    { $lte: [{ $toInt: "$rollRange.from" }, parseInt(user.rollNumber)] },
                    { $gte: [{ $toInt: "$rollRange.to" }, parseInt(user.rollNumber)] }
                ]
            }
        }).lean();
        
        
        // console.log("Assigned & Completed Quizzes:", assignedQuizzes);

        // ❌ 3. Find missed quizzes (assigned & completed but not attempted)
        const missedQuizzes = assignedQuizzes
            .filter((quiz) => !attemptedQuizIds.includes(quiz._id.toString()))
            .map((quiz) => ({
                _id: null,
                id: user._id,
                quizId: quiz._id,
                quizTitle: quiz.quizTitle,
                rollNumber: user.rollNumber,
                totalAutoScore: 0,
                totalFinalScore: 0,
                submittedAt: null,
                status: "Missed",
                createdTime: quiz.createdAt
            }));

        // console.log("Missed Quizzes:", missedQuizzes);

        // 📊 4. Combine results (attempted + missed)
        const fullHistory = [...attemptedQuizzes, ...missedQuizzes];

        // console.log("Final Full History:", fullHistory);

        // ⏳ 5. Sort by quiz submission time (if attempted), otherwise default order
        fullHistory.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

        return NextResponse.json(fullHistory);
    } catch (error) {
        console.error("❌ Failed to fetch quiz history:", error);
        return NextResponse.json({ message: "Failed to fetch history.", error }, { status: 500 });
    }
}
