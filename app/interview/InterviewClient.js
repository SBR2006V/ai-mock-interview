"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function InterviewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [time, setTime] = useState(0);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Get role
  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setRole(r);
  }, [searchParams]);

  // ✅ Fetch questions (FIXED)
  useEffect(() => {
    if (!role) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });

        // ✅ CHECK RESPONSE
        if (!res.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await res.json();

        // ✅ HARD VALIDATION
        if (!data || !Array.isArray(data.questions)) {
          throw new Error("Invalid API response");
        }

        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch (err) {
        console.error("Fetch Questions Error:", err);

        setQuestions(["Something went wrong. Please retry."]);
        setAnswers([""]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [role]);

  // ✅ Handle input
  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
    setError("");
  };

  // ✅ Handle next / submit
  const handleNext = async () => {
    if (!answers[currentIndex] || answers[currentIndex].trim() === "") {
      setError("Please write an answer before proceeding.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // 🔥 FINAL SUBMISSION
    setSubmitting(true);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role,
          answers: questions.map((q, i) => ({
            question: q,
            answer: answers[i],
          })),
        }),
      });

      // ✅ CHECK RESPONSE
      if (!res.ok) {
        throw new Error("Evaluation API failed");
      }

      const finalResult = await res.json();

      // 🔥 STREAK LOGIC (ADD HERE)
      const lastUsed = localStorage.getItem("last_used");
      const today = new Date().toDateString();

      if (lastUsed !== today) {
        let streak = Number(localStorage.getItem("streak")) || 0;
        streak++;
        localStorage.setItem("streak", streak);
        localStorage.setItem("last_used", today);
      }

      // ✅ BASIC VALIDATION
      if (!finalResult || typeof finalResult.score === "undefined") {
        throw new Error("Invalid evaluation response");
      }

      // ✅ Save result
      localStorage.setItem("result", JSON.stringify(finalResult));

      // ✅ Save history
      const newEntry = {
        type: "interview",
        role,
        score: finalResult.score,
        verdict: finalResult.verdict,
        full: finalResult,
        date: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };

      const existingHistory = JSON.parse(localStorage.getItem("history")) || [];

      existingHistory.push(newEntry);

      localStorage.setItem("history", JSON.stringify(existingHistory));

      router.push(`/result?role=${role}`);
    } catch (err) {
      console.error("Submit Error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Loading UI
  if (loadingQuestions) {
    return (
      <div className="container">
        <div className="card">
          <p>Generating AI questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <p className="progress">
          ⏱ {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </p>

        <p className="progress">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <h3 className="question">{questions[currentIndex]}</h3>

        <textarea
          className="textarea"
          value={answers[currentIndex] || ""}
          onChange={handleChange}
          placeholder="Type your answer here..."
        />

        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          {answers[currentIndex]?.length || 0} characters
        </p>

        {error && <p style={{ color: "#ef4444", marginTop: "8px" }}>{error}</p>}

        <button
          className="button blue"
          onClick={handleNext}
          disabled={submitting}
        >
          {submitting
            ? "Analyzing your answers..."
            : currentIndex === questions.length - 1
              ? "Finish Interview"
              : "Next"}
        </button>
      </div>
    </div>
  );
}
