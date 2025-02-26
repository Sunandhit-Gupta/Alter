import Quiz from '@/app/models/quiz';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Question from '@/app/models/question'
export async function GET(req, context) {
    try {
        // ✅ Await context.params properly
        const params = await context.params;

        if (!params?.quizId) {
            console.error("🚨 Missing params:", params);
            return NextResponse.json({ success: false, message: 'Quiz ID is required.' }, { status: 400 });
        }

        const { quizId } = params;
        await connectToDatabase();

        const quiz = await Quiz.findById(quizId).populate({
            path: 'questions',
            model: 'Question'
        });

        if (!quiz) {
            return NextResponse.json({ success: false, message: 'Quiz not found.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, questions: quiz.questions });
    } catch (error) {
        console.error('❌ Failed to fetch quiz questions:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch questions.' }, { status: 500 });
    }
}
