"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AptitudePage() {
  const router = useRouter();

  // 🔥 BETTER QUESTION POOL (15 QUESTIONS)
  const questionPool = [
    {
      q: "If a car travels 120 km in 2 hours, what is its speed?",
      options: ["40 km/h", "60 km/h", "80 km/h"],
      answer: "60 km/h",
    },
    { q: "What is 25% of 200?", options: ["25", "50", "75"], answer: "50" },
    { q: "If 3x = 12, what is x?", options: ["2", "3", "4"], answer: "4" },
    {
      q: "What comes next: 3, 9, 27, ?",
      options: ["54", "81", "72"],
      answer: "81",
    },
    {
      q: "If a train runs at 90 km/h, how far will it go in 2 hours?",
      options: ["120 km", "180 km", "200 km"],
      answer: "180 km",
    },
    {
      q: "What is the square root of 144?",
      options: ["10", "12", "14"],
      answer: "12",
    },
    {
      q: "If 5 workers complete a job in 10 days, how many days will 10 workers take?",
      options: ["5", "10", "20"],
      answer: "5",
    },
    { q: "What is 15% of 300?", options: ["30", "45", "60"], answer: "45" },
    {
      q: "If A=1, B=2, ..., what is the value of Z?",
      options: ["24", "25", "26"],
      answer: "26",
    },
    {
      q: "What is the next number: 2, 6, 18, ?",
      options: ["36", "54", "72"],
      answer: "54",
    },
    {
      q: "If a book costs ₹250 after a 20% discount, what was the original price?",
      options: ["300", "312.5", "280"],
      answer: "312.5",
    },
    {
      q: "What is the average of 10, 20, 30?",
      options: ["15", "20", "25"],
      answer: "20",
    },
    {
      q: "If a person walks 5 km in 1 hour, how far in 3 hours?",
      options: ["10 km", "15 km", "20 km"],
      answer: "15 km",
    },
    { q: "What is 2^5?", options: ["16", "32", "64"], answer: "32" },
    {
      q: "If the ratio of boys to girls is 2:3 and total students are 50, how many boys?",
      options: ["20", "25", "30"],
      answer: "20",
    },
  ];

  // 🔥 RANDOM 5 QUESTIONS
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let correct = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    setScore(correct);
    setSubmitted(true);

    // 🔥 SAVE TO HISTORY
    try {
      const history = JSON.parse(localStorage.getItem("history") || "[]");

      const newEntry = {
        type: "aptitude",
        score: correct, // out of 5 now
        date: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        full: { correct, total: questions.length },
      };

      const updated = [newEntry, ...history].slice(0, 10);

      localStorage.setItem("history", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save aptitude history");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🧠 Aptitude Challenge</h1>

        {!submitted ? (
          <>
            {questions.map((q, i) => (
              <div key={i} style={{ marginBottom: "20px", textAlign: "left" }}>
                <p>
                  <strong>{q.q}</strong>
                </p>

                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    style={{ display: "block", marginLeft: "10px" }}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      onChange={() => handleSelect(i, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            <button className="button green" onClick={handleSubmit}>
              Submit
            </button>
          </>
        ) : (
          <>
            <h2>
              Score: {score} / {questions.length}
            </h2>

            <button
              className="button blue"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
