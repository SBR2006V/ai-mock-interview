"use client";

export default function Home() {
  return (
    <div className="homeContainer">
      <div className="homeCard">
        <h1 className="homeTitle">AI Mock Interview</h1>
        <p className="homeSubtitle">
          Practice interviews and get instant feedback
        </p>

        <div className="buttonGroup">
          <button
            className="roleBtn blue"
            onClick={() =>
              (window.location.href = "/interview?role=frontend")
            }
          >
            💻 Frontend Developer
          </button>

          <button
            className="roleBtn green"
            onClick={() =>
              (window.location.href = "/interview?role=backend")
            }
          >
            ⚙️ Backend Developer
          </button>

          <button
            className="roleBtn purple"
            onClick={() =>
              (window.location.href = "/interview?role=hr")
            }
          >
            🧑‍💼 HR Interview
          </button>
        </div>
      </div>
    </div>
  );
}