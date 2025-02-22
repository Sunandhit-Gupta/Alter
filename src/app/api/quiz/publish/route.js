import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
    await connectToDatabase();

    try {
        const { quizId } = await req.json();

        if (!quizId) {
            return NextResponse.json({ message: "Quiz ID is required." }, { status: 400 });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found." }, { status: 404 });
        }

        if (quiz.status !== "Draft") {
            return NextResponse.json({ message: "Only draft quizzes can be published." }, { status: 400 });
        }

        quiz.status = "Published";
        quiz.updatedAt = new Date();
        await quiz.save();

        return NextResponse.json({ message: "Quiz published successfully!" });
    } catch (error) {
        console.error("Failed to publish quiz:", error);
        return NextResponse.json({ message: "Failed to publish quiz.", error }, { status: 500 });
    }
}
