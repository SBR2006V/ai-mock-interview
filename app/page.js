"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="homeContainer">
      <div className="homeCard">
        <h1 className="homeTitle">AI Mock Interview</h1>
        <p className="homeSubtitle">
          Practice interviews and get instant feedback
        </p>

        <div className="buttonGroup">
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

          {/* 🔥 NEW FEATURE */}
          <button
            className="roleBtn orange"
            onClick={() => router.push("/resume")}
          >
            📄 Resume Analyzer
          </button>
          <button
            className="roleBtn orange"
            onClick={() => router.push("/history")}
          >
            📊 View History
          </button>
        </div>
      </div>
    </div>
  );
}