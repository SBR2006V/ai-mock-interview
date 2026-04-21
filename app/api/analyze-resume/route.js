import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const data = await req.json();

    const prompt = `
Analyze this resume:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Education:
${data.education}

Skills:
${data.skills}

Projects:
${data.projects}

Give response ONLY in JSON format:
{
  "score": number (0-100),
  "summary": "short overall evaluation",
  "suggestions": ["point1", "point2", "point3"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content;

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}