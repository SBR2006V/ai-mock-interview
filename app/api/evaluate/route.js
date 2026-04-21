import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// 🔥 Force runtime execution (avoid build-time issues)
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // ✅ Safety check (prevents silent crashes)
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const { question, answer, role } = await request.json();

    // ✅ Initialize INSIDE function (CRITICAL FIX)
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
          You are an expert technical interviewer.

          Evaluate the candidate's answer for a ${role} role.

          Question: "${question}"
          Answer: "${answer}"

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

    // ✅ Clean response safely
    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      // fallback if AI gives slightly invalid JSON
      return NextResponse.json({
        raw: text,
        error: "Failed to parse AI response",
      });
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