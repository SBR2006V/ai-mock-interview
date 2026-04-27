import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // ✅ CHECK API KEY
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          score: 0,
          summary: "Server config error: Missing API key",
          suggestions: ["Contact developer"],
        },
        { status: 500 },
      );
    }

    const body = await request.json();

    // ✅ VALIDATE INPUT
    if (!body) {
      return NextResponse.json(
        {
          score: 0,
          summary: "Invalid input",
          suggestions: ["Provide resume data"],
        },
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
Analyze this resume and return STRICT JSON:

${JSON.stringify(body)}

Format:
{
  "score": number (0-100),
  "summary": "short summary",
  "suggestions": ["point 1", "point 2", "point 3"]
}

Rules:
- No markdown
- No explanation
- JSON only
`,
        },
      ],
    });

    const text = completion?.choices?.[0]?.message?.content;

    // ✅ PROTECT AGAINST EMPTY RESPONSE
    if (!text) {
      throw new Error("Empty AI response");
    }

    console.log("RAW AI RESPONSE:", text);

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("PARSE FAILED:", cleaned);

      return NextResponse.json({
        score: 50,
        summary: "Basic resume detected",
        suggestions: ["Improve structure", "Add projects", "Add skills"],
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        score: 40,
        summary: "Error analyzing resume",
        suggestions: ["Try again"],
      },
      { status: 500 },
    );
  }
}
