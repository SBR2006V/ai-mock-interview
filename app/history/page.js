"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="container">
      <div className="card">

        <h1 className="title">📊 History</h1>
        <p className="subtitle">Your past analyses</p>

        {/* 🔥 EMPTY STATE */}
        {history.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No history yet. Complete an interview or resume analysis.
          </p>
        )}

        {/* 🔥 HISTORY LIST */}
        <div style={{ marginTop: "20px" }}>
          {history.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                marginBottom: "12px",
                borderRadius: "12px",
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* TYPE */}
              <p style={{ fontSize: "14px", opacity: 0.7 }}>
                {item.type === "interview" ? "🎤 Interview" : "📄 Resume"}
              </p>

              {/* ROLE (only for interview) */}
              {item.role && (
                <p style={{ fontWeight: "600" }}>
                  Role: {item.role}
                </p>
              )}

              {/* SCORE */}
              <p>
                Score:{" "}
                <span style={{ color: "#22c55e", fontWeight: "600" }}>
                  {item.score}
                  {item.type === "interview" ? "/10" : "/100"}
                </span>
              </p>

              {/* VERDICT */}
              {item.verdict && (
                <p style={{ fontSize: "14px" }}>
                  Verdict: {item.verdict}
                </p>
              )}

              {/* DATE */}
              <p style={{ fontSize: "12px", opacity: 0.6 }}>
                {item.date}
              </p>
            </div>
          ))}
        </div>

        {/* 🔥 BUTTON */}
        <button
          className="button blue"
          style={{ marginTop: "15px" }}
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}