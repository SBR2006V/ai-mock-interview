import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { role } = await req.json();

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

    const text = completion.choices[0].message.content;

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { questions: ["Error generating questions"] },
      { status: 500 }
    );
  }
}