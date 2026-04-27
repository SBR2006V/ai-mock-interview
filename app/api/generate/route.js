import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ CHECK API KEY
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { questions: ["Server config error: Missing API key"] },
        { status: 500 },
      );
    }

    const body = await req.json();
    const role = body?.role;

    // ✅ VALIDATE INPUT
    if (!role) {
      return NextResponse.json(
        { questions: ["Invalid role provided"] },
        { status: 400 },
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Generate 3 realistic technical interview questions for a ${role} role.

Rules:
- Questions must be practical (not theory definitions)
- Keep them concise
- Return ONLY JSON format like:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}
`,
        },
      ],
    });

    const text = completion?.choices?.[0]?.message?.content;

    // ✅ PROTECT AGAINST EMPTY RESPONSE
    if (!text) {
      throw new Error("Empty AI response");
    }

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Bad AI response:", cleaned);
      return NextResponse.json({
        questions: ["Failed to generate questions"],
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { questions: ["Error generating questions"] },
      { status: 500 },
    );
  }
}
