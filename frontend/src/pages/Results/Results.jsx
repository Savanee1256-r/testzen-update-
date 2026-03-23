import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchMySubmissions } from "../../services/examService";
import "./Results.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Results() {
const { token, user } = useAuth();
const userRole = user?.role || 'student';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (!token) return;
        
        const submissionsData = await fetchMySubmissions(token);
        setResults(Array.isArray(submissionsData?.submissions) ? submissionsData.submissions : []);
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading results...</span>
      </div>
    );
  }

  return (
    <div className="results">
      <div className="results__header">
        <h2>My Results</h2>
        <p>View your exam performance and scores</p>
      </div>

      <div className="results__list">
{userRole === 'student' && results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No results available</h3>
            <p>Your exam results will appear here once you complete exams.</p>
          </div>
        ) : userRole === 'Teacher' && results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No students enrolled yet</h3>
            <p>Students will appear here after they submit exams.</p>
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={result._id}
              className="result-card"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="result-card__icon">📝</div>
              <div className="result-card__body">
                <div className="result-card__header">
                  <span className="result-card__title">{result.exam?.title || "Exam"}</span>
  <span className={`result-card__badge badge--published`}>
                    {result.published ? "Published" : "Submitted"}
                  </span>
                </div>
                <div className="result-card__meta">
                  <span className="result-card__meta-item">
                    Subject: {result.exam?.subject || "-"}
                  </span>
                  <span className="result-card__meta-item">
                    Completed: {formatDate(result.submittedAt)}
                  </span>
                  <span className="result-card__meta-item">
                    Total Marks: {result.maxScore || result.exam?.totalMarks || 0}
                  </span>
                </div>
                
                <div className="result-card__score">
                  <div className="result-card__score-bar">
                    <div
                      className="result-card__score-fill"
                      style={{ width: `${result.percentage || 0}%` }}
                    />
                  </div>
                  <div className="result-card__score-details">
                    <span className="result-card__score-text">
                      {result.totalMarks}/{result.maxScore || result.exam?.totalMarks || 0}
                    </span>
                    <span className="result-card__percentage">
                      {result.percentage || 0}%
                    </span>
                  </div>
                  {result.answers && result.answers.length > 0 && (
                    <details className="result-qa">
                      <summary>View Q/A ({result.answers.length} questions)</summary>
                      <div className="qa-list">
                        {result.answers.map((ans, idx) => (
                          <div key={idx} className={`qa-item ${ans.marks === ans.maxMarks ? 'correct' : 'incorrect'}`}>
                            <strong>Q{idx+1}:</strong> {ans.questionText}<br/>
                            Your: <strong>{ans.answer}</strong> 
                            {ans.correctAnswer && ans.correctAnswer !== ans.answer && (
                              <span> (Correct: <em>{ans.correctAnswer}</em>)</span>
                            )}
                            <br/><small>{ans.marks}/{ans.maxMarks} marks</small>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
