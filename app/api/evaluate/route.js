import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    // ✅ NEW INPUT (IMPORTANT CHANGE)
    const { answers, role } = await request.json();

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // 🔥 Convert all answers into text block
    const formattedQA = answers
      .map(
        (item, i) =>
          `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`
      )
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are an expert technical interviewer evaluating a candidate for a ${role} role.

Here are all the interview responses:

${formattedQA}

Analyze ALL answers together.

Evaluate:
- consistency across answers
- communication quality
- depth of knowledge

Respond ONLY in valid JSON format:

{
  "score": number (0-10),
  "verdict": "Excellent | Good | Average | Poor",
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "model_answer": ["point 1", "point 2"]
}

Rules:
- Keep each point short (1 line max)
- No paragraphs
- No explanations outside JSON
- No markdown
`
        },
      ],
    });

    const text = completion.choices[0].message.content;

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Bad AI response:", cleaned);

      // ✅ SAFE FALLBACK (VERY IMPORTANT)
      parsed = {
        score: 5,
        verdict: "Average",
        strengths: ["Could not parse AI response"],
        improvements: ["Try again"],
        model_answer: ["N/A"],
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}