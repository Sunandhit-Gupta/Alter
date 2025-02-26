import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Structured prompt to get a properly formatted JSON response
        const structuredPrompt = `
        Generate a multiple-choice quiz question based on: "${prompt}".
        The response should be **strictly** in this JSON format inside triple backticks:
        \`\`\`json
        {
            "question": "Generated question here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswers": ["Correct Option"]
        }
        \`\`\`
        Ensure that the correct answer(s) exist in the options.
        `;

        // Send request to Gemini API (1.5-flash)
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: structuredPrompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // Extract AI response (which is inside triple backticks)
        let generatedText = geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!generatedText) {
            console.error("❌ No response from AI");
            return NextResponse.json({ error: "Failed to generate a question" }, { status: 500 });
        }

        // **Fix: Remove the enclosing triple backticks and "json" label**
        generatedText = generatedText.replace(/^```json|```$/g, "").trim();

        // Parse the extracted JSON
        let structuredQuestion;
        try {
            structuredQuestion = JSON.parse(generatedText);
        } catch (parseError) {
            console.error("❌ AI response parsing error:", parseError);
            console.error("❌ AI raw output:", generatedText);
            return NextResponse.json({ error: "AI response format error" }, { status: 500 });
        }

        // Validate the response
        if (
            !structuredQuestion.question ||
            !Array.isArray(structuredQuestion.options) ||
            !Array.isArray(structuredQuestion.correctAnswers) ||
            structuredQuestion.options.length < 2 ||
            structuredQuestion.correctAnswers.length === 0
        ) {
            console.error("❌ Invalid AI-generated structure:", structuredQuestion);
            return NextResponse.json({ error: "Generated question is not in the expected format" }, { status: 500 });
        }

        // Format the response properly for frontend
        const parsedQuestion = {
            question: structuredQuestion.question,
            options: structuredQuestion.options.map((opt, index) => ({
                id: index + 1,
                text: opt,
            })),
            correctAnswers: structuredQuestion.correctAnswers,
        };
        return NextResponse.json({ success: true, data: parsedQuestion });
    } catch (error) {
        console.error("❌ Error generating question:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
