import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchExams } from "../../services/examService";

export default function TeacherHome({ onNavigate }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExams = async () => {
      try {
        if (!token) return;
        
        const examsData = await fetchExams(token);
        setExams(Array.isArray(examsData?.exams) ? examsData.exams : []);
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [token]);

  const quickActions = [
    {
      title: "Create New Exam",
      description: "Build a new examination with questions",
      icon: "➕",
      action: () => navigate("/teacher/create-exam"),
      color: "#3b82f6"
    },
    {
      title: "View Submissions",
      description: "Check student exam submissions",
      icon: "📋",
      action: () => onNavigate("submissions"),
      color: "#10b981"
    },
    {
      title: "Manage Results",
      description: "Publish and manage exam results",
      icon: "📊",
      action: () => onNavigate("results"),
      color: "#f59e0b"
    },
    {
      title: "View Students",
      description: "Manage enrolled students",
      icon: "👥",
      action: () => onNavigate("students"),
      color: "#8b5cf6"
    }
  ];

  return (
    <div className="fade-up">
      <div className="dashboard__page-header">
        <h1 className="dashboard__page-title">Welcome, {user?.name || "Teacher"}!</h1>
        <p className="dashboard__page-sub">Manage your exams and track student progress</p>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="action-card"
              onClick={action.action}
              style={{ borderLeftColor: action.color }}
            >
              <div className="action-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-stats">
        <h2>Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{exams.length}</div>
            <div className="stat-label">Total Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{exams.filter(e => e.status === 'published').length}</div>
            <div className="stat-label">Published Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Pending Submissions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Active Students</div>
          </div>
        </div>
      </div>

      <div className="recent-exams">
        <h2>Your Recent Exams</h2>
        <div className="exam-list">
          {exams.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No exams created yet</h3>
              <p>Create your first exam to get started!</p>
              <button className="btn btn-primary" onClick={() => navigate("/teacher/create-exam")}>
                Create Exam
              </button>
            </div>
          ) : (
            exams.slice(0, 5).map((exam, index) => (
              <div key={exam._id} className="exam-item">
                <div className="exam-info">
                  <h4>{exam.title}</h4>
                  <p>{exam.subject} • {exam.duration} mins • {exam.questions?.length || 0} questions</p>
                </div>
                <div className="exam-status">
                  <span className={`status-badge ${exam.status === 'published' ? 'published' : 'draft'}`}>
                    {exam.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
