import Quiz from "@/app/models/quiz";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET request to fetch ongoing quizzes for a specific roll number
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const rollNumber = searchParams.get("rollNumber");

    if (!rollNumber) {
        return NextResponse.json({ message: "Roll number is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const quizzes = await Quiz.find({
            status: "Ongoing",
            $or: [
                { uniqueRolls: rollNumber },
                {
                    $and: [
                        { "rollRange.from": { $lte: rollNumber } },
                        { "rollRange.to": { $gte: rollNumber } }
                    ]
                }
            ]
        }).lean();

        return NextResponse.json(quizzes, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch ongoing quizzes:", error);
        return NextResponse.json({ message: "Failed to fetch ongoing quizzes", error }, { status: 500 });
    }
}
