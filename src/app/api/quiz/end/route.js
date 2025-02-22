import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { quizId } = await req.json();

        if (!quizId) {
            return NextResponse.json({ message: "Quiz ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        const quiz = await Quiz.findByIdAndUpdate(
            quizId,
            { status: "Completed", endTime: new Date() },
            { new: true }
        );

        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Quiz ended successfully!", quiz });
    } catch (error) {
        console.error("Failed to end quiz:", error);
        return NextResponse.json({ message: "Failed to end quiz", error }, { status: 500 });
    }
}
