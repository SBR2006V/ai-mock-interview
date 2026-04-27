"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Invalid history data");
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
    setShowConfirm(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">📊 History</h1>
        <p className="subtitle">Your past analyses</p>

        {/* EMPTY STATE */}
        {history.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No history yet. Complete an interview or resume analysis.
          </p>
        )}

        {/* HISTORY LIST */}
        <div style={{ marginTop: "20px" }}>
          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.type === "interview") {
                  localStorage.setItem("result", JSON.stringify(item.full));
                  router.push(`/result?role=${item.role}`);
                } else {
                  localStorage.setItem(
                    "resume_result",
                    JSON.stringify(item.full),
                  );
                  router.push(`/resume/result`);
                }
              }}
              style={{
                padding: "15px",
                marginBottom: "12px",
                borderRadius: "12px",
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <p style={{ fontSize: "14px", opacity: 0.7 }}>
                {item.type === "interview" ? "🎤 Interview" : "📄 Resume"}
              </p>

              {item.role && (
                <p style={{ fontWeight: "600" }}>Role: {item.role}</p>
              )}

              <p>
                Score:{" "}
                <span style={{ color: "#22c55e", fontWeight: "600" }}>
                  {item.score}
                  {item.type === "interview" ? "/10" : "/100"}
                </span>
              </p>

              {item.verdict && (
                <p style={{ fontSize: "14px" }}>Verdict: {item.verdict}</p>
              )}

              <p style={{ fontSize: "12px", opacity: 0.6 }}>{item.date}</p>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            className="button"
            style={{ background: "#ef4444", color: "white" }}
            onClick={() => setShowConfirm(true)}
          >
            🗑 Clear History
          </button>

          <button className="button blue" onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
      </div>

      {/* 🔥 CUSTOM MODAL */}
      {showConfirm && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>Clear History?</h3>
            <p style={{ opacity: 0.8 }}>This action cannot be undone.</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="button"
                style={{ background: "#ef4444", color: "white" }}
                onClick={clearHistory}
              >
                Yes, Clear
              </button>

              <button className="button" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
