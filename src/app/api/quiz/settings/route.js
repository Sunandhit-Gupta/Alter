import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Quiz from '@/app/models/quiz';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET: Fetch Quiz Settings
// GET: Fetch Quiz Settings
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

        // Send dates in UTC, frontend will convert to local time
        const settings = {
            shuffleQuestions: quiz.shuffleQuestions ?? false,
            duration: quiz.duration ?? 30,
            startTime: quiz.startTime?.toISOString() ?? null,
            endTime: quiz.endTime?.toISOString() ?? null
        };

        return NextResponse.json({ message: 'Quiz settings fetched successfully', settings });
    } catch (error) {
        console.error('Error fetching quiz settings:', error);
        return NextResponse.json({ message: 'Failed to fetch quiz settings' }, { status: 500 });
    }
}



// PUT: Update Quiz Settings
// PUT: Update Quiz Settings
export async function PUT(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, settings } = await req.json();
        const { shuffleQuestions, duration, startTime } = settings;

        if (!quizId) {
            return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
        }

        // Convert frontend timezone (local) to UTC before storing
        const startUTC = startTime ? new Date(startTime).toISOString() : null;
        const endUTC = startUTC ? new Date(new Date(startUTC).getTime() + duration * 60 * 1000).toISOString() : null;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            {
                $set: {
                    shuffleQuestions,
                    duration,
                    startTime: startUTC,
                    endTime: endUTC
                }
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

