import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Quiz from '@/app/models/quiz';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET: Fetch Quiz Settings
export async function GET(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const quizId = searchParams.get('quizId');

        if (!quizId) {
            return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        const settings = {
            shuffleQuestions: quiz.shuffleQuestions ?? false,
            duration: quiz.duration ?? 30,
        };

        return NextResponse.json({ message: 'Quiz settings fetched successfully', settings });
    } catch (error) {
        console.error('Error fetching quiz settings:', error);
        return NextResponse.json({ message: 'Failed to fetch quiz settings' }, { status: 500 });
    }
}

// PUT: Update Quiz Settings
export async function PUT(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, settings } = await req.json();

        if (!quizId) {
            return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { $set: { shuffleQuestions: settings.shuffleQuestions, duration: settings.duration } },
            { new: true }
        );

        if (!updatedQuiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Quiz settings updated successfully', updatedQuiz });
    } catch (error) {
        console.error('Error updating quiz settings:', error);
        return NextResponse.json({ message: 'Failed to update quiz settings' }, { status: 500 });
    }
}
