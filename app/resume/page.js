"use client";

import { useRouter } from "next/navigation";

export default function ResumeHome() {
  const router = useRouter();

  const handleStart = () => {
    try {
      // 🔥 RESET ANY PREVIOUS FLOW STATE
      sessionStorage.removeItem("resume_saved"); // if still used anywhere
      localStorage.removeItem("resume_result"); // prevent stale reuse
    } catch (err) {
      console.error("Reset failed");
    }

    router.push("/resume/form");
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <h1 className="title">AI Resume Analyzer</h1>

        <p className="subtitle">
          Get your resume evaluated with an ATS score
          <br />
          and improvement tips
        </p>

        <button
          className="button blue"
          style={{ marginTop: "20px", width: "100%" }}
          onClick={handleStart}
        >
          Start Resume Analysis
        </button>

        <button
          className="button"
          style={{
            marginTop: "10px",
            width: "100%",
            background: "#334155",
            color: "white",
          }}
          onClick={() => router.push("/")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
