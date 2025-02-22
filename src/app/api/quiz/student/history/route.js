import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET: Fetch student quiz history
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const studentEmail = searchParams.get("email");

    if (!studentEmail) {
        return NextResponse.json({ message: "Student email is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email: studentEmail });
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        const history = await StudentResponse.find({ studentId: user._id })
            .populate("quizId")
            .lean();

        const formattedHistory = history.map((entry) => ({
            _id: entry._id,
            quizTitle: entry.quizId.quizTitle,
            rollNumber: entry.rollNumber,
            totalAutoScore: entry.totalAutoScore,
            totalFinalScore: entry.totalFinalScore,
            submittedAt: entry.submittedAt
        }));

        return NextResponse.json(formattedHistory);
    } catch (error) {
        console.error("Failed to fetch quiz history:", error);
        return NextResponse.json({ message: "Failed to fetch history.", error }, { status: 500 });
    }
}
