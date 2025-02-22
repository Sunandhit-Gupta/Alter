import Quiz from "@/app/models/quiz";
import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// POST: Submit quiz answers and calculate score
export async function POST(req) {
    const { quizId, answers, studentEmail } = await req.json();

    if (!quizId || !answers || !studentEmail) {
        return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Fetch user and quiz
        const user = await User.findOne({ email: studentEmail });
        const quiz = await Quiz.findById(quizId).populate("questions");

        if (!user || !quiz) {
            return NextResponse.json({ message: "User or quiz not found." }, { status: 404 });
        }

        const rollNumber = user.rollNumber;
        let totalAutoScore = 0;

        // Prepare responses with auto-scoring
        const responses = quiz.questions.map((question) => {
            const givenAnswer = answers[question._id] || [];
            const isCorrect = question.correctAnswer.every((ans) =>
                givenAnswer.includes(ans)
            );

            const autoScore = isCorrect ? 1 : 0;
            totalAutoScore += autoScore;

            return {
                questionId: question._id,
                givenAnswer,
                autoScore,
                finalScore: autoScore,
                feedback: ""
            };
        });

        // Store response in the database
        const studentResponse = new StudentResponse({
            quizId,
            studentId: user._id,
            rollNumber,
            responses,
            totalAutoScore,
            totalFinalScore: totalAutoScore,
            submittedAt: new Date()
        });

        await studentResponse.save();

        return NextResponse.json({
            message: "Quiz submitted successfully!",
            totalAutoScore
        });
    } catch (error) {
        console.error("Failed to submit quiz:", error);
        return NextResponse.json({ message: "Failed to submit quiz.", error }, { status: 500 });
    }
}
