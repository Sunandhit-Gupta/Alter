// /app/api/quiz/pending/route.js
import Quiz from '@/app/models/quiz';
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDatabase();
        const pendingQuizzes = await Quiz.find({ status: 'Draft' }).populate('createdBy', 'name');
        return NextResponse.json(pendingQuizzes);
    } catch (error) {
        console.error('Error fetching pending quizzes:', error);
        return NextResponse.json({ message: 'Failed to fetch pending quizzes' }, { status: 500 });
    }
}
