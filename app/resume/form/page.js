"use client";

import { useState } from "react";

export default function ResumeFormPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    projects: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      const safeData = {
        score: typeof data.score === "number" ? data.score : 50,
        summary: data.summary || "Basic resume detected.",
        suggestions:
          Array.isArray(data.suggestions) && data.suggestions.length > 0
            ? data.suggestions
            : ["Add more details"],
      };

      localStorage.setItem("resume_result", JSON.stringify(safeData));

      window.location.href = "/resume/result";

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "500px", margin: "auto" }}>
        
        <h1 className="title" style={{ textAlign: "center" }}>
          Resume Builder
        </h1>

        <p className="progress" style={{ textAlign: "center", marginBottom: "20px" }}>
          Step {step} of 3
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3>Basic Information</h3>

            <input className="input" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            <input className="input" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input className="input" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />

            <button className="button blue" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3>Education</h3>

            <textarea
              className="textarea"
              name="education"
              placeholder="Your education..."
              value={formData.education}
              onChange={handleChange}
              style={{ minHeight: "120px" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="button gray" style={{ flex: 1 }} onClick={prevStep}>
                Back
              </button>
              <button className="button blue" style={{ flex: 1 }} onClick={nextStep}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3>Skills & Projects</h3>

            <textarea
              className="textarea"
              name="skills"
              placeholder="Your skills..."
              value={formData.skills}
              onChange={handleChange}
              style={{ minHeight: "100px" }}
            />

            <textarea
              className="textarea"
              name="projects"
              placeholder="Your projects..."
              value={formData.projects}
              onChange={handleChange}
              style={{ minHeight: "100px" }}
            />

            {/* ✅ FIXED BUTTON ROW */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="button gray"
                style={{ flex: 1 }}
                onClick={prevStep}
              >
                Back
              </button>

              <button
                className="button green"
                style={{ flex: 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze My Resume"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}