import React from 'react'
import { useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/auth'
import '../styles/auth.css'

const TeacherDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <h2>Exam Management</h2>
        <p className="welcome-text">Welcome, teacher! Create exams and review student performance.</p>
        
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-icon">✏️</div>
            <h3>Create New Exam</h3>
            <p>Create and manage exams with multiple questions</p>
            <button 
              className="action-btn"
              onClick={() => navigate('/create-exam')}
            >
              Create Exam
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Results</h3>
            <p>Track student performance and analytics</p>
            <button 
              className="action-btn"
              onClick={() => navigate('/exam-results')}
            >
              View Results
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          margin-bottom: 30px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .dashboard-header h1 {
          font-size: 32px;
          margin: 0;
        }

        .logout-btn {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .dashboard-content {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .dashboard-content h2 {
          color: white;
          font-size: 24px;
          margin-bottom: 10px;
        }

        .welcome-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-bottom: 30px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .action-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .action-card h3 {
          color: #333;
          font-size: 20px;
          margin: 15px 0;
        }

        .action-card p {
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 6px;
          background-color: #667eea;
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .action-btn:hover {
          background-color: #5568d3;
        }

        .action-btn:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  )
}

export default TeacherDashboard
