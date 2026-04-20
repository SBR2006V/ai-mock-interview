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

  // ✅ Get role from URL
  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setRole(r);
  }, [searchParams]);

  // ✅ Fetch AI-generated questions
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

  // ✅ Handle typing
  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  // ✅ Handle Next / Submit
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // 🔥 Final submission (evaluate ALL answers)
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

      // ✅ Average score
      const avgScore =
        results.reduce((sum, r) => sum + (r.score || 0), 0) /
        results.length;

      const finalScore = Math.round(avgScore);

      // ✅ Merge feedback
      const strengths = results.map((r) => r.strengths).join(" ");
      const improvements = results.map((r) => r.improvements).join(" ");

      // Pick first model answer (simple strategy)
      const model_answer = results[0]?.model_answer || "";

      // ✅ Verdict logic
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

      // ✅ Store result
      localStorage.setItem("result", JSON.stringify(finalResult));
      localStorage.setItem("interview_done", "true");

      router.push(`/result?role=${role}`);
    } catch (err) {
      console.error(err);
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
          Question {currentIndex + 1} of {questions.length}
        </p>

        <h3 className="question">{questions[currentIndex]}</h3>

        <textarea
          className="textarea"
          value={answers[currentIndex] || ""}
          onChange={handleChange}
          placeholder="Type your answer here..."
        />

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