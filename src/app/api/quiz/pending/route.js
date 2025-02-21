import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Question from '@/app/models/question';
import Quiz from '@/app/models/quiz';
import User from '@/app/models/user';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET: Fetch Pending Quizzes
export async function GET() {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const pendingQuizzes = await Quiz.find({
            status: 'Draft',
            createdBy: userId
        }).lean();

        const user = await User.findById(userId);

        const quizzesWithUserName = pendingQuizzes.map(quiz => ({
            ...quiz,
            createdByName: user?.name || 'Unknown'
        }));

        return NextResponse.json(quizzesWithUserName);
    } catch (error) {
        console.error('Error fetching pending quizzes:', error);
        return NextResponse.json({ message: 'Failed to fetch pending quizzes' }, { status: 500 });
    }
}

// PUT: Update Quiz
export async function PUT(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, quizTitle, description, courseCode, batch } = await req.json();

        if (!quizId) {
            return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { quizTitle, description, courseCode, batch, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedQuiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json(updatedQuiz);
    } catch (error) {
        console.error('Error updating quiz:', error);
        return NextResponse.json({ message: 'Failed to update quiz' }, { status: 500 });
    }
}

// DELETE: Delete Quiz
// DELETE: Delete Quiz and Associated Questions
export async function DELETE(req) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = await req.json();

        if (!quizId) {
            return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
        }

        // Delete the quiz
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        if (!deletedQuiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        // Delete associated questions, if any
        const deletedQuestions = await Question.deleteMany({ quizId });

        return NextResponse.json({
            message: `Quiz deleted successfully. ${deletedQuestions.deletedCount || 0} associated questions removed.`,
        });
    } catch (error) {
        console.error('Error deleting quiz and questions:', error);
        return NextResponse.json({ message: 'Failed to delete quiz and questions' }, { status: 500 });
    }
}
