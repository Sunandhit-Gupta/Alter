import Question from "@/app/models/question";
import Quiz from "@/app/models/quiz";
import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectToDatabase();

    try {
        const { quizId, studentEmail, responses } = await req.json();

        if (!quizId || !studentEmail || !responses) {
            return NextResponse.json({ success: false, message: "❌ Missing required fields." }, { status: 400 });
        }

        // 🔍 Find user and quiz
        const user = await User.findOne({ email: studentEmail });
        const quiz = await Quiz.findById(quizId).populate("questions");
        if (!user) return NextResponse.json({ success: false, message: "❌ User not found." }, { status: 404 });
        if (!quiz) return NextResponse.json({ success: false, message: "❌ Quiz not found." }, { status: 404 });

        let totalAutoScore = 0;

        // 📝 Evaluate Responses
        const formattedResponses = await Promise.all(
            Object.entries(responses).map(async ([questionId, givenAnswer]) => {
                const question = await Question.findById(questionId);
                if (!question) return { questionId, givenAnswer, isCorrect: false, autoScore: 0 };

                // ✅ MCQ Evaluation (Single & Multiple Correct)
                if (question.type.includes("MCQ")) {
                    const correctAnswers = question.correctAnswers.map(String);
                    const givenAnswers = Array.isArray(givenAnswer) ? givenAnswer.map(String) : [String(givenAnswer)];

                    const isCorrect =
                        question.type === "Single Correct MCQ"
                            ? givenAnswers.length === 1 && givenAnswers[0] === correctAnswers[0]
                            : JSON.stringify(givenAnswers.sort()) === JSON.stringify(correctAnswers.sort());

                    const autoScore = isCorrect ? question.points : 0;
                    totalAutoScore += autoScore;

                    return { questionId, givenAnswer, isCorrect, autoScore };
                }

                // ✍️ Subjective Evaluation
                if (question.type === "Subjective") {
                    try {
                        const { data } = await axios.post(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/api/subjectiveScore`,
                            {
                                question: question.text,
                                correctAnswer: question.correctAnswers[0] || "",
                                studentAnswer: givenAnswer,
                                totalMarks: question.points
                            }
                        );

                        const subjectiveScore = data?.score ?? 0;
                        totalAutoScore += subjectiveScore;

                        return { questionId, givenAnswer, isCorrect: null, autoScore: subjectiveScore };
                    } catch (error) {
                        console.error(`❌ Failed to evaluate subjective question ${questionId}:`, error);
                        return { questionId, givenAnswer, isCorrect: null, autoScore: 0 };
                    }
                }

                return { questionId, givenAnswer, isCorrect: false, autoScore: 0 };
            })
        );

        // 💾 Save Student Response
        const newResponse = new StudentResponse({
            quizId,
            studentId: user._id,
            rollNumber: user.rollNumber,
            responses: formattedResponses,
            totalAutoScore
        });

        await newResponse.save();

        // 🔑 Update user's submitted quizzes
        user.submittedQuizzes.push(quizId);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "✅ Quiz submitted and evaluated successfully!",
            totalAutoScore,
            responses: formattedResponses
        });
    } catch (err) {
        console.error("❌ Error submitting quiz:", err);
        return NextResponse.json({ success: false, message: "⚠️ Internal server error." }, { status: 500 });
    }
}
