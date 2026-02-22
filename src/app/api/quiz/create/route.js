import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
        quizTitle,
        description,
        duration,
        batch,
        courseCode,
        rollRange,
        uniqueRolls,
        startTime,
        endTime,
        status
    } = await request.json();
    if (!quizTitle || !description || !duration || !batch || !courseCode) {
        return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    try {
        const userId = session.user.id; // Ensure this field exists in your session
        if (!userId) {
            console.error("User ID not found in session.");
            return Response.json({ message: "User ID missing in session" }, { status: 400 });
        }

        const quiz = await Quiz.create({
            quizTitle,
            description,
            duration,
            batch,
            courseCode,
            rollRange,
            uniqueRolls,
            status: status || "Draft",
            startTime: startTime ? new Date(startTime) : null,
            endTime: endTime ? new Date(endTime) : null,
            createdBy: session.user.id,
        });


        return Response.json({ quizId: quiz._id }, { status: 201 });
    } catch (err) {
        console.error(err);
        return Response.json({ message: "Failed to create quiz" }, { status: 500 });
    }
}
