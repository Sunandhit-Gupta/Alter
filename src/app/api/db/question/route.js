import Question from '@/app/models/question';
import Quiz from '@/app/models/quiz';
import { connectToDatabase } from '@/lib/mongodb';


export async function POST(request) {
    const { quizId, type, text, options, correctAnswers, points } = await request.json();
    await connectToDatabase();

    try {
        const question = new Question({ quizId, type, text, options, correctAnswers, points });
        await question.save();
        await Quiz.findByIdAndUpdate(quizId, { $push: { questions: question._id } });
        return Response.json(question, { status: 201 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
