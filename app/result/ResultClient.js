"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setRole(r);

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

        {/* 🔥 HEADER (CENTERED) */}
        <div style={{ textAlign: "center" }}>
          <h1 className="title">Interview Result</h1>
          <p className="subtitle">Role: {role}</p>

          <h2 style={{ marginBottom: "10px" }}>
            Score: {feedback.score}/10
          </h2>

          {/* Progress bar */}
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

          {/* Verdict */}
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

        {/* 🔥 CONTENT (LEFT ALIGNED FIX) */}
        <div
          style={{
            textAlign: "left",
            maxWidth: "600px",
            margin: "20px auto 0",
            lineHeight: "1.6",
          }}
        >
          {/* Strengths */}
          <h3 className="sectionTitle">💪 Strengths</h3>
          <p style={{ opacity: 0.9 }}>
            {feedback.strengths}
          </p>

          {/* Improvements */}
          <h3 className="sectionTitle" style={{ marginTop: "20px" }}>
            ⚠ Improvements
          </h3>
          <p style={{ opacity: 0.9 }}>
            {feedback.improvements}
          </p>

          {/* Model Answer */}
          <h3 className="sectionTitle" style={{ marginTop: "20px" }}>
            ✅ Model Answer
          </h3>
          <p style={{ opacity: 0.9 }}>
            {feedback.model_answer}
          </p>
        </div>

        {/* 🔥 BUTTON */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button
            className="button green"
            onClick={() => router.push("/")}
          >
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
}