import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchSubmissions, publishResult } from "../../services/examService";

export default function Results() {
  const { token } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (!token) return;
        
        const submissionsData = await fetchSubmissions(token);
        setResults(Array.isArray(submissionsData?.submissions) ? submissionsData.submissions : []);
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [token]);

  const handlePublishResult = async (resultId) => {
    try {
      await publishResult(resultId, token);
      alert("Result published successfully!");
    } catch (error) {
      console.error("Error publishing result:", error);
      alert("Failed to publish result. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading results...</span>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="dashboard__page-header">
        <h1 className="dashboard__page-title">Exam Results</h1>
        <p className="dashboard__page-sub">Manage and publish student exam results</p>
      </div>

      <div className="card">
        <div className="results-list">
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No student submissions yet</h3>
              <p>Student results appear here after exam submissions.</p>
            </div>
          ) : (
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Exam</th>
                    <th>Type</th>
                    <th>Marks</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result._id || index}>
                      <td>{result.student?.name || "N/A"}</td>
                      <td>{result.exam?.title || "N/A"}</td>
                      <td>{result.exam?.type || "MCQ"}</td>
                      <td>{result.totalMarks}/{result.maxScore || 0}</td>
                      <td>
                        <span className={`status-badge ${result.published ? 'published' : 'draft'}`}>
                          {result.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        {!result.published && (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handlePublishResult(result._id)}
                          >
                            Publish
                          </button>
                        )}
                        <button className="btn btn-sm btn-secondary">
                          View Details
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

