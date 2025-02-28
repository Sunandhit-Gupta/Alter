import Question from '@/app/models/question';
import StudentResponse from '@/app/models/studentResponse';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
    const { quizId, studentId, rollNumber, responses } = await request.json();
    await connectToDatabase();

    try {
        let totalAutoScore = 0;
        const formattedResponses = await Promise.all(responses.map(async (response) => {
            const question = await Question.findById(response.questionId);
            let autoScore = 0;

            if (question.type !== 'Subjective') {
                const isCorrect = JSON.stringify(response.givenAnswer.sort()) === JSON.stringify(question.correctAnswers.sort());
                autoScore = isCorrect ? question.points : 0;
                totalAutoScore += autoScore;
            }

            return { ...response, autoScore, finalScore: autoScore };
        }));

        const studentResponse = new StudentResponse({ quizId, studentId, rollNumber, responses: formattedResponses, totalAutoScore, totalFinalScore: totalAutoScore });
        await studentResponse.save();
        return Response.json(studentResponse, { status: 201 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    const { quizId } = request.nextUrl.searchParams;
    await connectToDatabase();

    try {
        const results = await StudentResponse.find({ quizId }).populate('studentId', 'name rollNumber');
        return Response.json(results, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
