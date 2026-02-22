export const runtime = "nodejs";

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// DEBUG ENV
console.log("ENV CHECK:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "exists" : "missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "missing",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    console.log("Upload request received");

    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      console.log("No file found");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File size:", file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Uploading to cloudinary...");

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "quizmate_questions" }, (err, res) => {
          if (err) {
            console.log("Cloudinary error:", err);
            reject(err);
          } else {
            resolve(res);
          }
        })
        .end(buffer);
    });

    console.log("Upload success");

    return NextResponse.json({ url: result.secure_url });

  } catch (error) {
    console.error("FULL UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}