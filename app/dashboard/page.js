"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  const [avgScore, setAvgScore] = useState(0);
  const [readiness, setReadiness] = useState(0);
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

      let interviewTotal = 0;
      let interviewCount = 0;

      let resumeTotal = 0;
      let resumeCount = 0;

      let aptitudeTotal = 0;
      let aptitudeCount = 0;

      storedHistory.forEach((item) => {
        if (item.type === "interview") {
          interviewTotal += item.score;
          interviewCount++;
        } else if (item.type === "resume") {
          resumeTotal += item.score;
          resumeCount++;
        } else if (item.type === "aptitude") {
          aptitudeTotal += item.score; // score out of 3
          aptitudeCount++;
        }
      });

      // 🔥 AVERAGES
      const interviewAvg = interviewCount ? interviewTotal / interviewCount : 0;

      const resumeAvg = resumeCount ? resumeTotal / resumeCount : 0;

      const aptitudeAvg = aptitudeCount ? aptitudeTotal / aptitudeCount : 0;

      // 🔥 AVG SCORE (DISPLAY ONLY)
      const combinedAvg =
        interviewCount + resumeCount > 0
          ? (
              (interviewAvg * interviewCount * 10 + resumeAvg * resumeCount) /
              (interviewCount + resumeCount) /
              10
            ).toFixed(1)
          : 0;

      setAvgScore(combinedAvg);

      // 🔥 READINESS SCORE (MAIN FEATURE)
      const readinessScore =
        interviewAvg * 10 * 0.4 +
        resumeAvg * 0.4 +
        aptitudeAvg * (100 / 3) * 0.2;

      setReadiness(Math.round(readinessScore));

      // 🔥 RECENT ACTIVITY
      setRecent(storedHistory.slice(0, 3));

      // 🔥 INSIGHT
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
        setInsight(
          "🚀 Use both interview and resume features to unlock insights.",
        );
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

          <p
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#22c55e",
            }}
          >
            🚀 Readiness Score: {readiness}/100
          </p>

          {/* 🔥 PROGRESS BAR */}
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
                width: `${readiness}%`,
                height: "10px",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              }}
            />
          </div>

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
                {item.type === "interview"
                  ? "/10"
                  : item.type === "resume"
                    ? "/100"
                    : item.type === "aptitude"
                      ? "/5"
                      : ""}
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
