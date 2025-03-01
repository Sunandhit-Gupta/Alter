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
            showSingleQuestion: quiz.showSingleQuestion ?? false,
            duration: quiz.duration ?? 30,
            startTime: quiz.startTime?.toISOString() ?? null,
            endTime: quiz.endTime?.toISOString() ?? null,
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
        const { shuffleQuestions, showSingleQuestion, duration, startTime } = settings;

        if (!quizId) {
            return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
        }

        if (!startTime) {
            return NextResponse.json({ message: 'Start time is required' }, { status: 400 });
        }

        if (duration <= 0) {
            return NextResponse.json({ message: 'Duration must be greater than 0' }, { status: 400 });
        }

        // Convert startTime from local time string to UTC
        const startLocal = new Date(startTime);
        if (isNaN(startLocal.getTime())) {
            return NextResponse.json({ message: 'Invalid start time' }, { status: 400 });
        }
        const startUTCString = startLocal.toISOString();

        // Calculate endTime in UTC based on startTime and duration
        const endUTC = new Date(startLocal.getTime() + duration * 60 * 1000);
        const endUTCString = endUTC.toISOString();



const updatedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    {
        $set: {
            shuffleQuestions,
            showSingleQuestion, // Add this
            duration,
            startTime: startUTCString,
            endTime: endUTCString,
        },
    },
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