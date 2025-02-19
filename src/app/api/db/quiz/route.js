import { connectToDatabase } from '@/lib/mongodb';
import Quiz from '@/models/quiz';

export async function POST(request) {
    const { quizTitle, description, duration, batch, courseCode, rollRange, uniqueRolls, shuffleQuestions, createdBy } = await request.json();
    await connectToDatabase();

    try {
        const quiz = new Quiz({ quizTitle, description, duration, batch, courseCode, rollRange, uniqueRolls, shuffleQuestions, createdBy });
        await quiz.save();
        return Response.json(quiz, { status: 201 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    const { quizId } = await request.json();
    await connectToDatabase();

    try {
        const quiz = await Quiz.findByIdAndUpdate(quizId, { status: 'Ongoing', startTime: new Date() }, { new: true });
        return Response.json(quiz, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    await connectToDatabase();

    try {
        const quizzes = await Quiz.find();
        return Response.json(quizzes, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
