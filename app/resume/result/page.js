"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeResultPage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  // Load result
  useEffect(() => {
    const stored = localStorage.getItem("resume_result");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  // 🔥 SAVE RESUME HISTORY
  useEffect(() => {
  if (!data) return;

  const history = JSON.parse(localStorage.getItem("history") || "[]");

  const newEntry = {
    type: "resume",
    score: data.score,
    date: new Date().toLocaleString(),
    full: data, // 🔥 IMPORTANT
  };

  const updatedHistory = [newEntry, ...history].slice(0, 10);

  localStorage.setItem("history", JSON.stringify(updatedHistory));
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

        <div style={{ textAlign: "center" }}>
          <h1 className="title">Resume Analysis</h1>
          <h2>ATS Score: {data.score}/100</h2>

          <div style={{
            width: "100%",
            background: "#1e293b",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "20px",
          }}>
            <div style={{
              width: `${data.score}%`,
              height: "10px",
              background: "linear-gradient(90deg, #22c55e, #16a34a)",
            }} />
          </div>
        </div>

        <div style={{
          textAlign: "left",
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          <h3>📌 Summary</h3>
          <p>{data.summary}</p>

          <h3>🚀 Suggestions</h3>
          <ul>
            {data.suggestions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="button green" onClick={() => router.push("/resume")}>
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
}