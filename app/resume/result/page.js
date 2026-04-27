"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeResultPage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  // 🔥 LOAD DATA
  useEffect(() => {
    try {
      const stored = localStorage.getItem("resume_result");

      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
      } else {
        router.push("/"); // fallback
      }
    } catch {
      console.error("Invalid JSON in resume_result");
      router.push("/");
    }
  }, [router]);

  // 🔥 STREAK + HISTORY (FIXED)
  useEffect(() => {
    if (!data) return;

    try {
      // ✅ STREAK LOGIC (SAFE - CLIENT ONLY)
      const lastUsed = localStorage.getItem("last_used");
      const today = new Date().toDateString();

      if (lastUsed !== today) {
        let streak = Number(localStorage.getItem("streak")) || 0;
        streak++;
        localStorage.setItem("streak", streak);
        localStorage.setItem("last_used", today);
      }

      // ✅ HISTORY SAVE WITH DUPLICATE CHECK
      const history = JSON.parse(localStorage.getItem("history") || "[]");

      const newEntry = {
        type: "resume",
        score: data.score,
        date: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        full: data,
      };

      const last = history[0];

      if (
        last &&
        last.type === "resume" &&
        last.score === newEntry.score &&
        JSON.stringify(last.full) === JSON.stringify(newEntry.full)
      ) {
        return; // 🚫 prevent duplicate
      }

      const updated = [newEntry, ...history].slice(0, 10);

      localStorage.setItem("history", JSON.stringify(updated));
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [data]);

  if (!data) {
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
        {/* HEADER */}
        <div style={{ textAlign: "center" }}>
          <h1 className="title">Resume Analysis</h1>

          <h2 style={{ marginBottom: "10px" }}>ATS Score: {data.score}/100</h2>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              background: "#1e293b",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: `${data.score}%`,
                height: "10px",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div
          style={{
            textAlign: "left",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          <h3>📌 Summary</h3>
          <p style={{ opacity: 0.9 }}>{data.summary}</p>

          <h3 style={{ marginTop: "20px" }}>🚀 Suggestions</h3>

          <ul style={{ paddingLeft: "20px" }}>
            {Array.isArray(data.suggestions) &&
              data.suggestions.map((item, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  {item}
                </li>
              ))}
          </ul>
        </div>

        {/* BUTTONS */}
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <button
            className="button green"
            onClick={() => router.push("/resume")}
          >
            Try Again
          </button>

          <button
            className="button"
            style={{
              marginTop: "10px",
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
