import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  const { question, answer, role } = await request.json();

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
`
      }
    ],
  });

  const text = completion.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return NextResponse.json(parsed);
}