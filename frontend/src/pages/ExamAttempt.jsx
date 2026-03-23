import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitExam, fetchExamById } from "../services/examService";
import "./ExamAttempt.css";

export default function ExamAttempt({ exam: propExam, onComplete }) {
  const { token } = useAuth();
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(propExam);
  const [examLoading, setExamLoading] = useState(!propExam);
  const questions = Array.isArray(exam?.questions) ? exam.questions : [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((exam?.duration || 60) * 60);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Load exam data if not provided via props
  useEffect(() => {
    if (examId && !propExam) {
      const loadExam = async () => {
        try {
          const examData = await fetchExamById(examId, token);
          setExam(examData);
        } catch (error) {
          console.error("Error loading exam:", error);
          alert("Failed to load exam. Redirecting to dashboard...");
          navigate("/student/dashboard");
        } finally {
          setExamLoading(false);
        }
      };
      loadExam();
    }
  }, [examId, propExam, token, navigate]);

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate("/student/dashboard");
    }
  };

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (submitted || !questions.length) return;

      setLoading(true);

      try {
        const submissionData = {
          examId: exam._id,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        };

        await submitExam(submissionData, token || localStorage.getItem("token"));
        setSubmitted(true);
        if (!isAutoSubmit) {
          alert("Exam submitted successfully.");
        }
        
        // Navigate to result page with result data
        const resultData = {
          questions: questions,
          answers: answers,
          examTitle: exam.title,
          submittedAt: new Date().toISOString()
        };
        
        console.log("Saving result data:", resultData);
        console.log("Questions structure:", questions);
        console.log("Answers structure:", answers);
        
        const resultId = `result_${Date.now()}`;
        localStorage.setItem(`result_${resultId}`, JSON.stringify(resultData));
        navigate(`/exam/result/${resultId}`, { state: resultData });
      } catch (error) {
        console.error(error);
        alert(error.message || "Submission failed");
      } finally {
        setLoading(false);
      }
    },
    [answers, exam?._id, questions, submitted, token, navigate]
  );

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit, submitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion._id]: value,
    }));
  };

  if (examLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div className="spinner" />
        <span>Loading exam...</span>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>{exam?.title || "Exam"}</h2>
        <p>No questions are available for this exam yet.</p>
      </div>
    );
  }

  const isMcq = currentQuestion?.type === "MCQ";
  const isLongAnswer = currentQuestion?.type === "THEORY" || currentQuestion?.type === "CODING";

  return (
    <div className="exam-container">
      <div className="exam-flex-container">
        <div className="exam-main">
          <h2>{exam.title}</h2>
          <p>Time Left: {formatTime(timeLeft)}</p>

          <div className="question-container">
            <h3>Question {currentQuestionIndex + 1}</h3>
            <p>{currentQuestion?.questionText}</p>

            {isMcq &&
              currentQuestion?.options?.map((option) => (
                <div key={option} className="option-label">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestion._id] === option}
                    onChange={() => handleAnswerChange(option)}
                  />
                  {option}
                </div>
              ))}

            {isLongAnswer && (
              <textarea
                className="textarea-answer"
                placeholder="Write your answer..."
                value={answers[currentQuestion._id] || ""}
                onChange={(event) => handleAnswerChange(event.target.value)}
              />
            )}
          </div>

          <div className="question-navigation">
            <div className="nav-buttons">
              <button
                className="nav-btn"
                onClick={() => setCurrentQuestionIndex((previous) => previous - 1)}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>

              <button
                className="nav-btn"
                onClick={() => setCurrentQuestionIndex((previous) => previous + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </button>

              <button className="nav-btn danger" onClick={() => handleSubmit(false)} disabled={loading}>
                {loading ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
            <div className="question-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
