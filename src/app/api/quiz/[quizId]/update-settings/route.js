import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
    const { quizId } = await context.params;
    const { shuffleQuestions, duration } = await req.json();

    if (!quizId) {
        return NextResponse.json({ success: false, message: "Quiz ID is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Update quiz settings
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, {
            shuffleQuestions,
            duration
        }, { new: true });

        if (!updatedQuiz) {
            return NextResponse.json({ success: false, message: "Quiz not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Quiz settings updated successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error updating quiz settings:", error);
        return NextResponse.json({ success: false, message: "Server error while updating settings." }, { status: 500 });
    }
}
