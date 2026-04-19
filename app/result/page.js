"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    setRole(searchParams.get("role") || "");

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("result");
      setResult(stored || "No result found.");
    }
  }, [searchParams]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Interview Result</h1>
        <p className="subtitle">Role: {role}</p>

        <div className="result">
          {result}
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