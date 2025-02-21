// /app/api/user/profile/route.js
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
        }

        const user = await User.findOne({ email }).lean();

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch user profile." }, { status: 500 });
    }
}
