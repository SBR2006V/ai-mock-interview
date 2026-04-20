"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // ✅ safe role extraction
    const r = searchParams.get("role");
    if (r) setRole(r);

    // ✅ safe localStorage parsing
    try {
      const stored = localStorage.getItem("result");
      if (stored) {
        setFeedback(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Invalid result data");
    }
  }, [searchParams]);

  if (!feedback) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading result...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Interview Result</h1>
        <p className="subtitle">Role: {role}</p>

        {/* 🔥 Score Section */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>
            Score: {feedback.score}/10
          </h2>

          {/* 🔥 Animated Progress Bar */}
          <div
            style={{
              width: "100%",
              background: "#1e293b",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: `${feedback.score * 10}%`,
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
                height: "10px",
                transition: "width 0.6s ease",
              }}
            />
          </div>

          {/* 🔥 Verdict Badge */}
          <span
            style={{
              background:
                feedback.verdict === "Excellent"
                  ? "#22c55e"
                  : feedback.verdict === "Good"
                  ? "#3b82f6"
                  : feedback.verdict === "Average"
                  ? "#f59e0b"
                  : "#ef4444",
              padding: "6px 12px",
              borderRadius: "20px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {feedback.verdict}
          </span>
        </div>

        {/* 🔥 Sections */}
        <h3 className="sectionTitle">💪 Strengths</h3>
        <p>{feedback.strengths}</p>

        <h3 className="sectionTitle">⚠ Improvements</h3>
        <p>{feedback.improvements}</p>

        <h3 className="sectionTitle">✅ Model Answer</h3>
        <p>{feedback.model_answer}</p>

        {/* 🔥 Proper Navigation */}
        <button
          className="button green"
          onClick={() => router.push("/")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}