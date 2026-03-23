import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchExams, fetchMySubmissions } from "../../services/examService";
import { MOCK_EXAMS } from "../../services/mockData";
import "./Exams.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CurrentExams({ exams, onAttemptExam }) {
  const navigate = useNavigate();
  const publishedExams = exams.filter((exam) => exam.status === "published");

  const handleStartExam = (exam) => {
    if (onAttemptExam) {
      onAttemptExam(exam);
    } else {
      navigate(`/exam/attempt/${exam._id}`);
    }
  };

  return (
    <div className="exams__list">
      {publishedExams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">No</div>
          <h3>No published exams</h3>
          <p>Check back later for new exams.</p>
        </div>
      ) : (
        publishedExams.map((exam, index) => (
          <div
            key={exam._id}
            className="exam-card exam-card--live"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <div className="exam-card__icon">Ex</div>
            <div className="exam-card__body">
              <div className="exam-card__header">
                <span className="exam-card__title">{exam.title}</span>
                <span className="exam-card__badge badge--published">Published</span>
              </div>
              <div className="exam-card__meta">
                <span className="exam-card__meta-item">Subject: {exam.subject}</span>
                <span className="exam-card__meta-item">Duration: {exam.duration} mins</span>
                <span className="exam-card__meta-item">Marks: {exam.totalMarks}</span>
                <span className="exam-card__meta-item">
                  Questions: {exam.questions?.length || 0}
                </span>
                <span className="exam-card__meta-item">Teacher: {exam.teacher}</span>
              </div>
              {exam.description && <div className="exam-card__instruction">{exam.description}</div>}
              <div className="exam-card__actions">
                <button className="btn btn-primary" onClick={() => handleStartExam(exam)}>
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Notices() {
  return (
    <div className="notices__list">
      {MOCK_EXAMS.notices.map((notice, index) => (
        <div
          key={notice._id}
          className={`notice-card${notice.priority === "high" ? " notice-card--high" : ""}`}
          style={{ animationDelay: `${index * 0.07}s` }}
        >
          <div className="notice-card__icon">{notice.priority === "high" ? "!" : "i"}</div>
          <div>
            <div className="notice-card__title">{notice.title}</div>
            <div className="notice-card__msg">{notice.message}</div>
            <div className="notice-card__date">{formatDate(notice.date)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubmittedExams({ submittedExams }) {
  return (
    <div className="exams__list">
      {submittedExams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">No</div>
          <h3>No submitted exams</h3>
          <p>Your submitted exam history will appear here.</p>
        </div>
      ) : (
        submittedExams.map((submission, index) => (
          <div
            key={submission._id}
            className="exam-card"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <div className="exam-card__icon">Ok</div>
            <div className="exam-card__body">
              <div className="exam-card__header">
                <span className="exam-card__title">{submission.exam?.title || "Exam"}</span>
                <span className={`exam-card__badge badge--${submission.status}`}>
                  {submission.status === "checked" ? "Checked" : "Pending"}
                </span>
              </div>
              <div className="exam-card__meta">
                <span className="exam-card__meta-item">
                  Subject: {submission.exam?.subject || "-"}
                </span>
                <span className="exam-card__meta-item">
                  Submitted: {formatDate(submission.submittedAt)}
                </span>
                <span className="exam-card__meta-item">
                  Total: {submission.maxScore || submission.exam?.totalMarks || 0} marks
                </span>
              </div>
              {submission.published ? (
                <div className="exam-card__score">
                  <div className="exam-card__score-bar">
                    <div
                      className="exam-card__score-fill"
                      style={{ width: `${submission.percentage || 0}%` }}
                    />
                  </div>
                  <span className="exam-card__score-text">
                    {submission.totalMarks}/{submission.maxScore || submission.exam?.totalMarks || 0}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.4rem" }}>
                  Result not yet published
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const TABS = [
  { id: "current", label: "Current Exams" },
  { id: "submitted", label: "Submitted" },
];

export default function Exams({ onAttemptExam }) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("current");
  const [exams, setExams] = useState([]);
  const [submittedExams, setSubmittedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExams = async () => {
      try {
        if (!token) return;

        const [examData, submissionData] = await Promise.all([
          fetchExams(token),
          fetchMySubmissions(token),
        ]);

        setExams(Array.isArray(examData?.exams) ? examData.exams : []);
        setSubmittedExams(Array.isArray(submissionData?.submissions) ? submissionData.submissions : []);
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading exams...</span>
      </div>
    );
  }

  return (
    <div className="exams">
      <div className="exams__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`exams__tab${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "current" && <CurrentExams exams={exams} onAttemptExam={onAttemptExam} />}
      {activeTab === "submitted" && <SubmittedExams submittedExams={submittedExams} />}

      {activeTab === "current" && <Notices />}
    </div>
  );
}
