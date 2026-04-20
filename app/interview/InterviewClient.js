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

  // 🔥 Timer
  const [time, setTime] = useState(0);

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

  // ✅ Fetch questions
  useEffect(() => {
    if (!role) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });

        const data = await res.json();

        const q = data.questions || ["Failed to load questions"];
        setQuestions(q);
        setAnswers(new Array(q.length).fill(""));
      } catch (err) {
        console.error(err);
        setQuestions(["Error loading questions"]);
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
    setError(""); // clear error when typing
  };

  // ✅ Handle next
  const handleNext = async () => {
    // 🔥 Validation (better than alert)
    if (!answers[currentIndex] || answers[currentIndex].trim() === "") {
      setError("Please write an answer before proceeding.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // 🔥 Final submission
    setSubmitting(true);

    try {
      const results = [];

      for (let i = 0; i < questions.length; i++) {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: questions[i],
            answer: answers[i],
            role: role,
          }),
        });

        const data = await res.json();
        results.push(data);
      }

      const avgScore =
        results.reduce((sum, r) => sum + (r.score || 0), 0) /
        results.length;

      const finalScore = Math.round(avgScore);

      const strengths = results.map((r) => r.strengths).join(" ");
      const improvements = results.map((r) => r.improvements).join(" ");

      const model_answer = results[0]?.model_answer || "";

      let verdict = "Poor";
      if (finalScore >= 8) verdict = "Excellent";
      else if (finalScore >= 6) verdict = "Good";
      else if (finalScore >= 4) verdict = "Average";

      const finalResult = {
        score: finalScore,
        verdict,
        strengths,
        improvements,
        model_answer,
      };

      localStorage.setItem("result", JSON.stringify(finalResult));
      localStorage.setItem("interview_done", "true");

      router.push(`/result?role=${role}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Loading screen
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
        {/* 🔥 Timer */}
        <p className="progress">
          ⏱ {Math.floor(time / 60)}:
          {(time % 60).toString().padStart(2, "0")}
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

        {/* 🔥 Character counter */}
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          {answers[currentIndex]?.length || 0} characters
        </p>

        {/* 🔥 Error message */}
        {error && (
          <p style={{ color: "#ef4444", marginTop: "8px" }}>{error}</p>
        )}

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