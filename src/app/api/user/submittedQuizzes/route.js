import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectToDatabase();

    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email }).select("submittedQuizzes");
        const submittedQuizzes = user?.submittedQuizzes || [];

        return NextResponse.json({ success: true, submittedQuizzes });
    } catch (err) {
        console.error("Failed to fetch submitted quizzes:", err);
        return NextResponse.json({ success: false, message: "Failed to fetch submitted quizzes." }, { status: 500 });
    }
}
