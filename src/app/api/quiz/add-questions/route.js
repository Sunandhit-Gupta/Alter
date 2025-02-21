import Question from "@/app/models/question";
import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { quizId, questions } = await req.json();

    if (!quizId || !questions?.length) {
      return NextResponse.json({ success: false, message: "Quiz ID and questions are required." }, { status: 400 });
    }

    await connectToDatabase();

    const questionDocs = [];

    // Iterate through each question and check for duplicates
    for (const q of questions) {
      const existingQuestion = await Question.findOne({
        quizId,
        text: q.text,
        options: { $size: q.options?.length, $all: q.options }
      });

      if (!existingQuestion) {
        const newQuestion = new Question({ ...q, quizId });
        await newQuestion.save();
        questionDocs.push(newQuestion._id);
      }
    }

    // Update the quiz with new question IDs
    if (questionDocs.length > 0) {
      await Quiz.findByIdAndUpdate(quizId, {
        $push: { questions: { $each: questionDocs } }
      });
    }

    return NextResponse.json({
      success: true,
      message: `${questionDocs.length} new question(s) added successfully!`
    }, { status: 200 });

  } catch (error) {
    console.error("Error adding questions:", error);
    return NextResponse.json({ success: false, message: "Server error while adding questions." }, { status: 500 });
  }
}
