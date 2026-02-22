export const runtime = "nodejs";

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // convert file → base64 (Vercel-safe)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "quizmate_questions",
    });

    return NextResponse.json({ url: result.secure_url });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}