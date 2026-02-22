import Question from "@/app/models/question";
import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { quizId, questions } = await req.json();

    if (!quizId || !questions?.length) {
      return NextResponse.json(
        { success: false, message: "Quiz ID and questions are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const questionDocs = [];

    for (const q of questions) {
      // ✅ Normalize images safely
      const normalizedImages = Array.isArray(q.images)
        ? q.images.filter(img => typeof img === "string")
        : [];

      // ✅ Build duplicate query (ignore options for subjective)
      const duplicateQuery = {
        quizId,
        text: q.text,
        type: q.type
      };

      if (q.type !== "Subjective") {
        duplicateQuery.options = {
          $size: q.options?.length || 0,
          $all: q.options || []
        };
      }

      const existingQuestion = await Question.findOne(duplicateQuery);

      if (!existingQuestion) {
        const newQuestion = new Question({
          quizId,
          text: q.text,
          type: q.type,
          options: q.options || [],
          correctAnswers: q.correctAnswers || [],
          points: q.points || 1,

          // ⭐ MULTIPLE IMAGE SUPPORT
          images: normalizedImages
        });

        await newQuestion.save();
        questionDocs.push(newQuestion._id);
      }

      if (normalizedImages.length > 5) {
        return NextResponse.json(
          { success: false, message: "Max 5 images allowed per question" },
          { status: 400 }
        );
      }
    }

    // Update quiz with new question IDs
    if (questionDocs.length > 0) {
      await Quiz.findByIdAndUpdate(quizId, {
        $push: { questions: { $each: questionDocs } }
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `${questionDocs.length} new question(s) added successfully!`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding questions:", error);
    return NextResponse.json(
      { success: false, message: "Server error while adding questions." },
      { status: 500 }
    );
  }
}