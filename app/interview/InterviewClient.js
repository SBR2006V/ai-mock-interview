"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function InterviewClient() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setRole(r);
  }, [searchParams]);

  const questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Why should we hire you?",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // User finished all questions, now call AI
      setLoading(true);

      // We evaluate the last answer (you can later evaluate all answers)
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentIndex],
          answer: answers[currentIndex],
          role: role,
        }),
      });

      const feedback = await res.json();

      // Save AI feedback to localStorage so ResultClient can read it
      localStorage.setItem("result", JSON.stringify(feedback));
      localStorage.setItem("interview_done", "true");

      setLoading(false);
      window.location.href = `/result?role=${role}`;
    }
  };

  return (
    <div className="container">
      <div className="card">
        <p className="progress">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <h3 className="question">{questions[currentIndex]}</h3>

        <textarea
          className="textarea"
          value={answers[currentIndex]}
          onChange={handleChange}
          placeholder="Type your answer here..."
        />

        <button className="button blue" onClick={handleNext} disabled={loading}>
          {loading
            ? "Analyzing your answer..."
            : currentIndex === questions.length - 1
            ? "Finish Interview"
            : "Next"}
        </button>
      </div>
    </div>
  );
}