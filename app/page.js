"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [streak, setStreak] = useState(0);

  // 🔥 LOAD STREAK
  useEffect(() => {
    try {
      const stored = localStorage.getItem("streak");
      if (stored) {
        setStreak(Number(stored));
      }
    } catch (err) {
      console.error("Failed to load streak");
    }
  }, []);

  return (
    <div className="homeContainer">
      <div className="homeCard">
        <h1 className="homeTitle">
          InterviewAI – Smart Mock Interview Platform
        </h1>

        <p className="homeSubtitle">
          Practice interviews and get instant feedback
        </p>

        {/* 🔥 STREAK DISPLAY */}
        <p
          style={{
            marginBottom: "15px",
            color: "#22c55e",
            fontWeight: "600",
          }}
        >
          🔥 Streak: {streak} day{streak !== 1 ? "s" : ""}
        </p>

        <div className="buttonGroup">
          {/* 🔥 DASHBOARD (MOVE TO TOP + STYLE IT) */}
          <button
            className="roleBtn"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              color: "white",
            }}
            onClick={() => router.push("/dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className="roleBtn blue"
            onClick={() => router.push("/interview?role=frontend")}
          >
            💻 Frontend Developer
          </button>

          <button
            className="roleBtn green"
            onClick={() => router.push("/interview?role=backend")}
          >
            ⚙️ Backend Developer
          </button>

          <button
            className="roleBtn purple"
            onClick={() => router.push("/interview?role=hr")}
          >
            🧑‍💼 HR Interview
          </button>

          <button
            className="roleBtn orange"
            onClick={() => router.push("/resume")}
          >
            📄 Resume Analyzer
          </button>

          <button
            className="roleBtn red"
            onClick={() => router.push("/history")}
          >
            📊 View History
          </button>
          <button
            className="roleBtn"
            style={{
              background: "linear-gradient(135deg, #facc15, #eab308)",
              color: "black",
            }}
            onClick={() => router.push("/aptitude")}
          >
            🧠 Aptitude Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
