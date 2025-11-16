import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Modify the structured prompt to request multiple questions
        const structuredPrompt = `
        Generate **3 multiple-choice quiz questions or theory questions** based on: "${prompt}".
        Each question should follow this JSON format inside triple backticks:
        \`\`\`json
        {
            "questions": [
                {
                    "question": "Generated question 1",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswers": ["Correct Option"]
                },
                {
                    "question": "Generated question 2",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswers": ["Correct Option"]
                },
                {
                    "question": "Generated question 3",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswers": ["Correct Option"]
                }
            ]
        }
        \`\`\`
        Ensure that the correct answer(s) exist in the options.
        `;

        // Send request to Gemini API (1.5-flash)
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
            return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
        }

        // **Fix: Remove the enclosing triple backticks and "json" label**
        generatedText = generatedText.replace(/^```json|```$/g, "").trim();

        // Parse the extracted JSON
        let structuredQuestions;
        try {
            structuredQuestions = JSON.parse(generatedText);
        } catch (parseError) {
            console.error("❌ AI response parsing error:", parseError);
            console.error("❌ AI raw output:", generatedText);
            return NextResponse.json({ error: "AI response format error" }, { status: 500 });
        }

        // Validate the response
        if (!structuredQuestions.questions || !Array.isArray(structuredQuestions.questions) || structuredQuestions.questions.length === 0) {
            console.error("❌ Invalid AI-generated structure:", structuredQuestions);
            return NextResponse.json({ error: "Generated questions are not in the expected format" }, { status: 500 });
        }

        // Format the response properly for frontend
        const parsedQuestions = structuredQuestions.questions.map((q, index) => ({
            id: index + 1,
            text: q.question,
            options: q.options.map((opt, idx) => ({ id: idx + 1, text: opt })),
            correctAnswers: q.correctAnswers,
            type: q.correctAnswers.length > 1 ? "Multiple Correct MCQ" : "Single Correct MCQ",
        }));

        return NextResponse.json({ success: true, data: parsedQuestions });
    } catch (error) {
        console.error("❌ Error generating questions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
