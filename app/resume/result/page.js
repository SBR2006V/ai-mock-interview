"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeResultPage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("resume_result");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

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

        {/* 🔥 HEADER (CENTERED) */}
        <div style={{ textAlign: "center" }}>
          <h1 className="title">Resume Analysis</h1>

          <h2 style={{ marginBottom: "10px" }}>
            ATS Score: {data.score}/100
          </h2>

          {/* Progress bar */}
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

        {/* 🔥 CONTENT (LEFT ALIGNED + READABLE) */}
        <div
          style={{
            textAlign: "left",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          {/* SUMMARY */}
          <h3 className="sectionTitle">📌 Summary</h3>
          <p style={{ opacity: 0.9 }}>
            {data.summary}
          </p>

          {/* SUGGESTIONS */}
          <h3 className="sectionTitle" style={{ marginTop: "20px" }}>
            🚀 Suggestions
          </h3>

          <ul style={{ paddingLeft: "20px" }}>
            {data.suggestions.map((item, i) => (
              <li key={i} style={{ marginBottom: "10px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 🔥 BUTTON */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button
            className="button green"
            onClick={() => router.push("/resume")}
          >
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
}