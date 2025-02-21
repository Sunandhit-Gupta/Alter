import Quiz from '@/app/models/quiz';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // 🟢 Extract quizId from the request URL
        const url = new URL(req.url);
        const quizId = url.pathname.split('/').at(-2); // Gets the dynamic [quizId]
        if (!quizId) {
            return NextResponse.json({ success: false, message: 'Quiz ID is required.' }, { status: 400 });
        }

        await connectToDatabase();

        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return NextResponse.json({ success: false, message: 'Quiz not found.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, questions: quiz.questions });
    } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch questions.' }, { status: 500 });
    }
}
