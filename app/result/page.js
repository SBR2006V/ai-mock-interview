"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [result, setResult] = useState("");

  useEffect(() => {
  const storedResult = localStorage.getItem("result");

  if (storedResult) {
    // simulate slight delay = feels like AI thinking
    setTimeout(() => {
      setResult(storedResult);
    }, 500);
  } else {
    setResult("No result found.");
  }
}, []);

  const formatResult = (text) => {
    if (!text) return null;

    const lines = text.split("\n");

    return (
      <div>
        {lines.map((line, index) => {
          if (line.trim() === "") return null;

          // ✅ SCORE (premium style)
          if (line.includes("Score")) {
  const scoreValue = line.split(":")[1]?.trim();

  return (
    <div key={index} className="score">
      ⭐ {scoreValue}
    </div>
  );
}

          // ✅ STRENGTHS
          if (line.includes("Strengths")) {
            return (
              <h3 key={index} className="sectionTitle">
                💪 {line}
              </h3>
            );
          }

          // ✅ IMPROVEMENTS
          if (line.includes("Improvements")) {
            return (
              <h3 key={index} className="sectionTitle">
                🚀 {line}
              </h3>
            );
          }

          // ✅ BULLETS
          if (line.trim().startsWith("-")) {
            return (
              <p key={index} className="bullet">
                {line}
              </p>
            );
          }

          return <p key={index}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Interview Result</h1>
        <p className="subtitle">Role: {role}</p>

        <div className="result">
          {formatResult(result)}
        </div>

        <button
          className="button green"
          onClick={() => (window.location.href = "/")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}