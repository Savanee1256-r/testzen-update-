import React from "react";
import "./QuestionDashboard.css";

const QuestionDashboard = ({ questions, answers, currentIndex, setCurrentIndex }) => {
  const getStatus = (q, index) => {
    if (index === currentIndex) return "current"; // highlight current question
    if (answers[q._id] && answers[q._id].trim() !== "") return "answered"; // answered (any type)
    return "not-answered"; // unattempted
  };

  return (
    <div className="question-dashboard">
      <h3>Questions</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {questions.map((q, index) => (
          <button
            key={q._id}
            className={`dash-btn ${getStatus(q, index)}`}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDashboard;