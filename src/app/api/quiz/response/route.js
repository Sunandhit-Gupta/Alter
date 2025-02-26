import StudentResponse from "@/app/models/studentResponse";
import Quiz from "@/app/models/quiz";
import Question from "@/app/models/question";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    const studentId = searchParams.get("studentId");

    if (!quizId || !studentId) {
        return NextResponse.json({ message: "Quiz ID and Student ID are required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Fetch student response
        const response = await StudentResponse.findOne({ quizId, studentId }).lean();
        if (!response) {
            return NextResponse.json({ message: "Response not found." }, { status: 404 });
        }

        // Fetch quiz with populated questions
        const quiz = await Quiz.findById(quizId).populate("questions").lean();
        if (!quiz) {
            return NextResponse.json({ message: "Quiz not found." }, { status: 404 });
        }

        // Fetch student details
        const student = await User.findById(studentId).lean();

        // Prepare response data
        const responseData = {
            studentName: student?.name || "Unknown",
            rollNumber: response.rollNumber,
            responses: response.responses.map((resp) => ({
                questionId: resp.questionId.toString(),
                givenAnswer: resp.givenAnswer,
                autoScore: resp.autoScore,
                finalScore: resp.finalScore,
                feedback: resp.feedback
            })),
            totalAutoScore: response.totalAutoScore,
            totalFinalScore: response.totalFinalScore,
            submittedAt: response.submittedAt
        };

        // Prepare quiz data
        const quizData = {
            quizTitle: quiz.quizTitle,
            questions: quiz.questions.map((q) => ({
                _id: q._id.toString(),
                type: q.type,
                text: q.text,
                options: q.options,
                correctAnswers: q.correctAnswers,
                points: q.points
            }))
        };

        return NextResponse.json({ response: responseData, quiz: quizData });
    } catch (error) {
        console.error("Failed to fetch response details:", error);
        return NextResponse.json({ message: "Failed to fetch response details.", error }, { status: 500 });
    }
}