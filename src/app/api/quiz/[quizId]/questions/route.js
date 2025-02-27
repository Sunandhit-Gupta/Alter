import Quiz from '@/app/models/quiz';
import Question from '@/app/models/question'
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

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

        // Return relevant quiz data along with questions
        return NextResponse.json({
            success: true,
            questions: quiz.questions,
            quiz: {
                _id: quiz._id,
                quizTitle: quiz.quizTitle,
                description: quiz.description,
                duration: quiz.duration,
                shuffleQuestions: quiz.shuffleQuestions,
                startTime: quiz.startTime,
                endTime: quiz.endTime
            }
        });
    } catch (error) {
        console.error('❌ Failed to fetch quiz questions:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch questions.' }, { status: 500 });
    }
}