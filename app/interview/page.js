"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

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
      // MOCK RESULT
      const result = `
Score: 8/10

Strengths:
- Clear communication
- Strong motivation

Improvements:
- Add real project examples
- Be more technical
`;

      localStorage.setItem("result", result);
      window.location.href = `/result?role=${role}`;
    }
  };

  return (
  <div className="container">
    <div className="card">
      
      {/* PROGRESS BAR */}
      <div className="progressBar">
        <div
          className="progressFill"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <p className="progress">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <h3 className="question">{questions[currentIndex]}</h3>

      <textarea
        className="answerBox"
        value={answers[currentIndex]}
        onChange={handleChange}
        placeholder="Write a clear, confident answer..."
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