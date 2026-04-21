"use client";

import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">AI Resume Analyzer</h1>

        <p className="subtitle">
          Get your resume evaluated with an ATS score and improvement tips
        </p>

        <button
          className="button blue"
          onClick={() => router.push("/resume/form")}
        >
          Start Resume Analysis
        </button>
      </div>
    </div>
  );
}