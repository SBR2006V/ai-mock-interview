"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function InterviewClient() {
  const searchParams = useSearchParams();

  const [role, setRole] = useState("");

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

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const result = `
Score: 8/10

Strengths:
- Clear communication
- Strong motivation

Improvements:
- Add real project examples
- Be more technical
`;

      if (typeof window !== "undefined") {
        localStorage.setItem("result", result);
        window.location.href = `/result?role=${role}`;
      }
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

        <button className="button blue" onClick={handleNext}>
          {currentIndex === questions.length - 1
            ? "Finish Interview"
            : "Next"}
        </button>
      </div>
    </div>
  );
}