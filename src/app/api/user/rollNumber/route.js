import User from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET request to fetch user roll number by email
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findOne({ email }).select("rollNumber").lean();

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        return NextResponse.json({ rollNumber: user.rollNumber }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch user roll number:", error);
        return NextResponse.json({ message: "Failed to fetch roll number", error }, { status: 500 });
    }
}
