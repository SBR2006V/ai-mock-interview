"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  const [avgScore, setAvgScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [recent, setRecent] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
      const storedStreak = Number(localStorage.getItem("streak")) || 0;

      setHistory(storedHistory);
      setStreak(storedStreak);

      if (storedHistory.length === 0) return;

      // 🔥 TOTAL ATTEMPTS
      setTotalAttempts(storedHistory.length);

      // 🔥 AVERAGE SCORE (normalize resume to /10)
      let total = 0;
      let count = 0;

      let interviewTotal = 0;
      let interviewCount = 0;

      let resumeTotal = 0;
      let resumeCount = 0;

      storedHistory.forEach((item) => {
        if (item.type === "interview") {
          total += item.score;
          interviewTotal += item.score;
          interviewCount++;
          count++;
        } else if (item.type === "resume") {
          const normalized = item.score / 10;
          total += normalized;
          resumeTotal += normalized;
          resumeCount++;
          count++;
        }
      });

      const avg = count ? (total / count).toFixed(1) : 0;
      setAvgScore(avg);

      // 🔥 RECENT 3
      setRecent(storedHistory.slice(0, 3));

      // 🔥 INSIGHT (simple but powerful)
      if (interviewCount && resumeCount) {
        const intAvg = interviewTotal / interviewCount;
        const resAvg = resumeTotal / resumeCount;

        if (resAvg > intAvg) {
          setInsight(
            "📄 Your resume is stronger than your interview performance.",
          );
        } else if (intAvg > resAvg) {
          setInsight("🎤 Your interview skills are stronger than your resume.");
        } else {
          setInsight("⚖️ Your resume and interview performance are balanced.");
        }
      } else {
        setInsight("🚀 Start using more features to unlock insights.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">📊 Dashboard</h1>
        <p className="subtitle">Your performance overview</p>

        {/* 🔥 STATS */}
        <div style={{ marginBottom: "20px" }}>
          <p>
            🔥 Streak: <strong>{streak}</strong>
          </p>
          <p>
            📊 Avg Score: <strong>{avgScore}/10</strong>
          </p>
          <p>
            🎯 Attempts: <strong>{totalAttempts}</strong>
          </p>
        </div>

        {/* 🔥 INSIGHT */}
        <div className="result">
          <p>
            <strong>Insight:</strong>
          </p>
          <p>{insight}</p>
        </div>

        {/* 🔥 RECENT ACTIVITY */}
        <div style={{ marginTop: "20px" }}>
          <h3>🕒 Recent Activity</h3>

          {recent.length === 0 && <p>No activity yet</p>}

          {recent.map((item, i) => (
            <div key={i} style={{ marginTop: "10px" }}>
              <p>
                {item.type === "interview" ? "🎤" : "📄"} {item.type} — Score:{" "}
                {item.score}
                {item.type === "interview" ? "/10" : "/100"}
              </p>
              <p style={{ fontSize: "12px", opacity: 0.6 }}>{item.date}</p>
            </div>
          ))}
        </div>

        {/* 🔥 BUTTON */}
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <button className="button blue" onClick={() => router.push("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
