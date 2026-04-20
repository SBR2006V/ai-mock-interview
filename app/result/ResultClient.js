"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultClient() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("result");
    if (stored) {
      setFeedback(JSON.parse(stored));
    }
  }, []);

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

        <div className="score">
          Score: {feedback.score}/10 — {feedback.verdict}
        </div>

        <h3>💪 Strengths</h3>
        <p>{feedback.strengths}</p>

        <h3>🚀 What to Improve</h3>
        <p>{feedback.improvements}</p>

        <h3>✅ Model Answer</h3>
        <p>{feedback.model_answer}</p>

        <button
          className="button green"
          onClick={() => (window.location.href = "/")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}