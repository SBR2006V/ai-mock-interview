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
You are an expert interviewer evaluating a candidate for a ${role} role.

Question asked: "${question}"
Candidate's answer: "${answer}"

Evaluate the answer and respond ONLY in this exact JSON format, nothing else:
{
  "score": <number from 0 to 10>,
  "verdict": "<one word: Excellent, Good, Average, or Poor>",
  "strengths": "<one sentence about what was good>",
  "improvements": "<one sentence about what to improve>",
  "model_answer": "<a brief ideal answer in 2-3 sentences>"
}
`,
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