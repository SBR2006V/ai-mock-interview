"use client";

import { useState } from "react";

export default function ResumeFormPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    projects: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Resume Builder</h1>

        {/* STEP INDICATOR */}
        <p className="progress">Step {step} of 3</p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h3>Basic Information</h3>

            <input
              className="input"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              className="input"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              className="input"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <button className="button blue" onClick={nextStep}>
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h3>Education</h3>

            <textarea
              className="textarea"
              name="education"
              placeholder="Your education details..."
              value={formData.education}
              onChange={handleChange}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="button gray" onClick={prevStep}>
                Back
              </button>

              <button className="button blue" onClick={nextStep}>
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h3>Skills & Projects</h3>

            <textarea
              className="textarea"
              name="skills"
              placeholder="Your skills..."
              value={formData.skills}
              onChange={handleChange}
            />

            <textarea
              className="textarea"
              name="projects"
              placeholder="Your projects..."
              value={formData.projects}
              onChange={handleChange}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="button gray" onClick={prevStep}>
                Back
              </button>

              <button
                className="button green"
                onClick={async () => {
                try {
                    const res = await fetch("/api/analyze-resume", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                console.log(data);

                localStorage.setItem("resume_result", JSON.stringify(data));

                localStorage.setItem("resume_result", JSON.stringify(data));

                window.location.href = "/resume/result";
            } catch (err) {
                console.error(err);
                alert("Something went wrong");
            }
        }}
              >
                Analyze My Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}