import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { question, correctAnswer, studentAnswer, totalMarks } = await req.json();

        if (!question || !correctAnswer || !studentAnswer || !totalMarks) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        // Prepare the prompt for evaluation
        const prompt = `
        Evaluate the student's answer based on the given question and correct answer.
        Assign marks out of ${totalMarks} considering clarity, correctness, and depth.
        If the student's answer is better than the correct answer, award full marks.
        Only return a numeric score (like 7.5) without additional text and if student has covered all concepts proided in the answer of teacher then student should be awarded full marks.

        Question: ${question}
        Correct Answer: ${correctAnswer}
        Student's Answer: ${studentAnswer}
        `;

        // Send request to Gemini API
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // Extract the score from the response
        const scoreText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        const score = parseFloat(scoreText);

        if (isNaN(score) || score < 0 || score > totalMarks) {
            return NextResponse.json({ error: "Invalid score received from Gemini API." }, { status: 500 });
        }

        return NextResponse.json({ score });
    } catch (error) {
        console.error("Error evaluating subjective score:", error);
        return NextResponse.json({ error: "Failed to evaluate the answer." }, { status: 500 });
    }
}
