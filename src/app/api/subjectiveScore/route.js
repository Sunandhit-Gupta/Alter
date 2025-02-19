import { NextResponse } from 'next/server';

const POST = async (req) => {
  try {
    // Parse the request body
    const { correctAnswer, userAnswer, totalMarks } = await req.json();

    // Validate inputs
    if (
      typeof correctAnswer !== "string" ||
      typeof userAnswer !== "string" ||
      typeof totalMarks !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input: Please provide valid values." },
        { status: 400 }
      );
    }

    // Tokenizer: lowercases text, removes punctuation, and splits on whitespace
    const tokenize = (text) =>
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);

    // Tokenize both answers
    const correctTokens = new Set(tokenize(correctAnswer));
    const userTokens = new Set(tokenize(userAnswer));

    // Compute the intersection count between the two token sets
    let intersectionCount = 0;
    for (const word of correctTokens) {
      if (userTokens.has(word)) {
        intersectionCount++;
      }
    }

    // Compute the union of tokens
    const unionTokens = new Set([...correctTokens, ...userTokens]);
    const unionCount = unionTokens.size;

    // Compute the Jaccard similarity score
    const similarityScore = unionCount > 0 ? intersectionCount / unionCount : 0;

    // Calculate the final score by multiplying the similarity score with total marks
    const finalScore = Math.round(similarityScore * totalMarks);

    // Return the score as JSON
    return NextResponse.json({ score: finalScore }, { status: 200 });
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export { POST };
