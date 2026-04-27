"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setRole(r);

    try {
      const stored = localStorage.getItem("result");

      if (stored) {
        setFeedback(JSON.parse(stored));
      } else {
        // ❗ NO DATA → REDIRECT
        router.push("/");
      }
    } catch (err) {
      console.error("Invalid result data");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [searchParams, router]);

  // ✅ Proper loading state
  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading result...</p>
        </div>
      </div>
    );
  }

  // ❗ Safety fallback
  if (!feedback) {
    return (
      <div className="container">
        <div className="card">
          <p>No result found. Please try again.</p>
          <button className="button blue" onClick={() => router.push("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        {/* HEADER */}
        <div style={{ textAlign: "center" }}>
          <h1 className="title">Interview Result</h1>
          <p className="subtitle">Role: {role}</p>

          <h2>Score: {feedback.score}/10</h2>

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
                height: "10px",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              }}
            />
          </div>

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
            }}
          >
            {feedback.verdict}
          </span>
        </div>

        {/* CONTENT */}
        <div
          style={{
            textAlign: "left",
            maxWidth: "600px",
            margin: "20px auto",
          }}
        >
          <h3>💪 Strengths</h3>
          <ul>
            {(Array.isArray(feedback.strengths)
              ? feedback.strengths
              : feedback.strengths
                ? [feedback.strengths]
                : []
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>⚠ Improvements</h3>
          <ul>
            {(Array.isArray(feedback.improvements)
              ? feedback.improvements
              : feedback.improvements
                ? [feedback.improvements]
                : []
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>✅ Model Answer</h3>
          <ul>
            {(Array.isArray(feedback.model_answer)
              ? feedback.model_answer
              : feedback.model_answer
                ? [feedback.model_answer]
                : []
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ACTION */}
        <div style={{ textAlign: "center" }}>
          <button className="button green" onClick={() => router.push("/")}>
            Try Again
          </button>
        </div>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            className="button"
            style={{
              background: "#334155",
              color: "white",
            }}
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
