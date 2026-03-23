import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createExam } from "../../services/examService";

export default function CreateExam({ onNavigate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: 60,
    totalMarks: 0,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: "mcq",
    text: "",
    marks: 1,
    options: ["", "", "", ""],
    correctAnswer: "",
    starterCode: "",
    expectedOutput: ""
  });

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert("Please enter question text");
      return;
    }

    if (currentQuestion.type === "mcq" && !currentQuestion.correctAnswer) {
      alert("Please select the correct answer for MCQ");
      return;
    }

    const newQuestion = { ...currentQuestion };
    const updatedQuestions = [...examData.questions, newQuestion];

    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions,
      totalMarks: updatedQuestions.reduce((sum, q) => sum + q.marks, 0)
    }));

    // Reset current question
    setCurrentQuestion({
      type: "mcq",
      text: "",
      marks: 1,
      options: ["", "", "", ""],
      correctAnswer: "",
      starterCode: "",
      expectedOutput: ""
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = examData.questions.filter((_, i) => i !== index);
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions,
      totalMarks: updatedQuestions.reduce((sum, q) => sum + q.marks, 0)
    }));
  };

  const handleSubmit = async (publish = false) => {
    if (!examData.title.trim() || !examData.subject.trim()) {
      alert("Please fill in exam title and subject");
      return;
    }

    if (examData.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...examData,
        teacher: user?.name || "Teacher",
        status: publish ? "published" : "draft"
      };

      await createExam(payload, localStorage.getItem('token'));
      alert(`Exam ${publish ? 'created and published' : 'saved as draft'} successfully!`);
      navigate("/teacher/dashboard");
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  return (
    <div className="fade-up">
      <div className="dashboard__page-header">
        <h1 className="dashboard__page-title">Create New Exam</h1>
        <p className="dashboard__page-sub">Build your exam with multiple question types</p>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Exam Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Exam Title *</label>
            <input
              type="text"
              value={examData.title}
              onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Computer Science Mid-term Exam"
              required
            />
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              value={examData.subject}
              onChange={(e) => setExamData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Computer Science"
              required
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={examData.duration}
              onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
              min="1"
              max="300"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={examData.description}
              onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional exam instructions..."
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Add Question</h3>

        <div className="form-group">
          <label>Question Type</label>
          <select
            value={currentQuestion.type}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="mcq">Multiple Choice Question (MCQ)</option>
            <option value="theory">Long Answer/Theory</option>
            <option value="coding">Coding Question</option>
          </select>
        </div>

        <div className="form-group">
          <label>Question Text *</label>
          <textarea
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter your question here..."
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Marks</label>
          <input
            type="number"
            value={currentQuestion.marks}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) || 1 }))}
            min="1"
            max="100"
          />
        </div>

        {currentQuestion.type === "mcq" && (
          <div className="form-group">
            <label>Options</label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === option}
                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: option }))}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
            <small>Select the radio button next to the correct answer</small>
          </div>
        )}

        {currentQuestion.type === "coding" && (
          <>
            <div className="form-group">
              <label>Starter Code (optional)</label>
              <textarea
                value={currentQuestion.starterCode}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, starterCode: e.target.value }))}
                placeholder="Provide starter code for students..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Expected Output (for evaluation)</label>
              <textarea
                value={currentQuestion.expectedOutput}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, expectedOutput: e.target.value }))}
                placeholder="What should the correct output be?"
                rows="3"
              />
            </div>
          </>
        )}

        <button className="btn btn-secondary" onClick={addQuestion}>
          ➕ Add Question
        </button>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>Questions Added ({examData.questions.length})</h3>
        <p>Total Marks: {examData.totalMarks}</p>

        {examData.questions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❓</div>
            <p>No questions added yet</p>
          </div>
        ) : (
          <div className="question-list">
            {examData.questions.map((question, index) => (
              <div key={index} className="question-item">
                <div className="question-header">
                  <span className="question-type">{question.type.toUpperCase()}</span>
                  <span className="question-marks">{question.marks} marks</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeQuestion(index)}
                  >
                    ✕
                  </button>
                </div>
                <p className="question-text">{question.text}</p>

                {question.type === "mcq" && (
                  <div className="mcq-options">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className={`option ${option === question.correctAnswer ? 'correct' : ''}`}>
                        {option}
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "coding" && question.starterCode && (
                  <div className="code-preview">
                    <strong>Starter Code:</strong>
                    <pre>{question.starterCode}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn btn-ghost" onClick={() => navigate("/teacher/dashboard")}>
          Cancel
        </button>
        <div className="publish-buttons">
          <button
            className="btn btn-secondary"
            onClick={() => handleSubmit(false)}
            disabled={loading || examData.questions.length === 0}
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleSubmit(true)}
            disabled={loading || examData.questions.length === 0}
          >
            {loading ? "Publishing..." : "Create & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
