import Question from "@/app/models/question";
import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { quizId, questionId } = await req.json();

    if (!quizId || !questionId) {
      return NextResponse.json({ success: false, message: "Quiz ID and Question ID are required." }, { status: 400 });
    }

    await connectToDatabase();

    // Delete question from Question collection
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return NextResponse.json({ success: false, message: "Question not found." }, { status: 404 });
    }

    // Remove question ID from the Quiz document
    await Quiz.findByIdAndUpdate(quizId, { $pull: { questions: questionId } });

    return NextResponse.json({ success: true, message: "Question deleted successfully!" });

  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ success: false, message: "Server error while deleting question." }, { status: 500 });
  }
}
