"use client";
import QuizQuesComp from "@/app/components/quizQuesComp";
import { useParams } from "next/navigation";

export default function AddQuestionsPage() {
    const { quizId } = useParams();

    if (!quizId) {
        return <p className="text-center text-red-500">Quiz ID not found!</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Add Questions to Quiz</h1>
            <QuizQuesComp quizId={quizId} />
        </div>
    );
}
