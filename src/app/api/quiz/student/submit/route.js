import Question from "@/app/models/question";
import StudentResponse from "@/app/models/studentResponse";
import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { quizId, responses, studentEmail } = await req.json();
        if (!quizId || !responses || !studentEmail) {
            return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
        }

        await connectToDatabase();

        // 🟢 Get student details
        const student = await User.findOne({ email: studentEmail });
        if (!student) {
            return NextResponse.json({ success: false, message: "Student not found." }, { status: 404 });
        }

        const rollNumber = student.rollNumber;
        const studentId = student._id;
        let totalAutoScore = 0;

        // 🟢 Process Each Response
        const responseArray = await Promise.all(
            Object.entries(responses).map(async ([questionId, givenAnswer]) => {
                const question = await Question.findById(questionId);
                let autoScore = 0;

                if (question?.type === "Single Correct MCQ") {
                    if (question.correctAnswers.includes(givenAnswer[0])) autoScore = question.points;
                }

                if (question?.type === "Multiple Correct MCQ") {
                    const correctSet = new Set(question.correctAnswers);
                    const givenSet = new Set(givenAnswer);
                    const isCorrect = givenSet.size === correctSet.size && [...givenSet].every((ans) => correctSet.has(ans));
                    if (isCorrect) autoScore = question.points;
                }

                return {
                    questionId,
                    givenAnswer,
                    autoScore,
                    finalScore: autoScore,
                };
            })
        );

        totalAutoScore = responseArray.reduce((sum, r) => sum + r.autoScore, 0);

        // 🟢 Save Student Response
        const newResponse = new StudentResponse({
            quizId,
            studentId,
            rollNumber,
            responses: responseArray,
            totalAutoScore,
            totalFinalScore: totalAutoScore,
        });

        await newResponse.save();

        return NextResponse.json({ success: true, message: "Quiz submitted successfully." });
    } catch (error) {
        console.error("Failed to submit quiz:", error);
        return NextResponse.json({ success: false, message: "Failed to submit quiz." }, { status: 500 });
    }
}
