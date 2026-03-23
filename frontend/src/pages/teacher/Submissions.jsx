import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchSubmissions } from "../../services/examService";

export default function Submissions() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        if (!token) return;
        
        const submissionsData = await fetchSubmissions(token);
        setSubmissions(Array.isArray(submissionsData?.submissions) ? submissionsData.submissions : []);
      } catch (error) {
        console.error("Error loading submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":
        return <span className="status-badge graded">Graded</span>;
      case "pending":
        return <span className="status-badge pending">Pending</span>;
      default:
        return <span className="status-badge submitted">Submitted</span>;
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="dashboard__page-header">
        <h1 className="dashboard__page-title">Submissions</h1>
        <p className="dashboard__page-sub">Review and grade student exam submissions</p>
      </div>

      <div className="card">
        <div className="submissions-list">
          {submissions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No submissions yet</h3>
              <p>Student submissions will appear here once exams are completed.</p>
            </div>
          ) : (
            <div className="submissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Exam</th>
                    <th>Submitted</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={submission._id || index}>
                      <td>{submission.student?.name || "N/A"}</td>
                      <td>{submission.exam?.title || "N/A"}</td>
                      <td>
                        {submission.submittedAt 
                          ? new Date(submission.submittedAt).toLocaleDateString()
                          : "N/A"
                        }
                      </td>
                      <td>
                        {submission.totalMarks !== undefined 
                          ? `${submission.totalMarks}/${submission.maxScore || 0}`
                          : "Not graded"
                        }
                      </td>
                      <td>{getStatusBadge(submission.status)}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
