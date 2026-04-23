import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

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

    const text = completion.choices[0].message.content;

    console.log("RAW AI RESPONSE:", text);

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("PARSE FAILED:", cleaned);

      // 🔥 RETURN SAFE FALLBACK (CRITICAL)
      return NextResponse.json({
        score: 50,
        summary: "Basic resume detected",
        suggestions: ["Improve structure", "Add projects", "Add skills"],
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);

    // 🔥 NEVER FAIL HARD
    return NextResponse.json({
      score: 40,
      summary: "Error analyzing resume",
      suggestions: ["Try again"],
    });
  }
}