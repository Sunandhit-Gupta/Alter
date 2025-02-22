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
            { status: "Ongoing", startTime: new Date() },
            { new: true }
        );

        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Quiz started successfully!", quiz });
    } catch (error) {
        console.error("Failed to start quiz:", error);
        return NextResponse.json({ message: "Failed to start quiz", error }, { status: 500 });
    }
}
