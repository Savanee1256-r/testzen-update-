import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamResults.css';

const ExamResults = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate fetching exam data
    setTimeout(() => {
      const mockExams = [
        {
        _id: '1',
        examName: 'Java Basics Quiz',
          subject: 'Java Programming',
          totalQuestions: 5,
          totalMarks: 25,
          createdAt: new Date('2026-03-15'),
          studentCount: 45,
        },
        {
          _id: '2',
          examName: 'Python Advanced',
          subject: 'Python Programming',
          totalQuestions: 10,
          totalMarks: 50,
          createdAt: new Date('2026-03-18'),
          studentCount: 32,
        },
        {
          _id: '3',
          examName: 'Web Development',
          subject: 'Web Technologies',
          totalQuestions: 8,
          totalMarks: 40,
          createdAt: new Date('2026-03-20'),
          studentCount: 28,
        },
      ];
      setExams(mockExams);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    // Simulate fetching results for selected exam
    const mockResults = [
      {
        _id: '1',
        studentName: 'John Doe',
        studentEmail: 'john@example.com',
        marksObtained: 22,
        totalMarks: exam.totalMarks,
        percentage: ((22 / exam.totalMarks) * 100).toFixed(2),
        status: 'Completed',
        submittedAt: new Date('2026-03-15T10:30:00'),
      },
      {
        _id: '2',
        studentName: 'Jane Smith',
        studentEmail: 'jane@example.com',
        marksObtained: 18,
        totalMarks: exam.totalMarks,
        percentage: ((18 / exam.totalMarks) * 100).toFixed(2),
        status: 'Completed',
        submittedAt: new Date('2026-03-15T11:00:00'),
      },
      {
        _id: '3',
        studentName: 'Mike Johnson',
        studentEmail: 'mike@example.com',
        marksObtained: 25,
        totalMarks: exam.totalMarks,
        percentage: ((25 / exam.totalMarks) * 100).toFixed(2),
        status: 'Completed',
        submittedAt: new Date('2026-03-15T09:45:00'),
      },
      {
        _id: '4',
        studentName: 'Sarah Williams',
        studentEmail: 'sarah@example.com',
        marksObtained: 15,
        totalMarks: exam.totalMarks,
        percentage: ((15 / exam.totalMarks) * 100).toFixed(2),
        status: 'In Progress',
        submittedAt: null,
      },
    ];
    setResults(mockResults);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Completed' ? 'badge-completed' : 'badge-inprogress';
  };

  const filteredResults = results.filter(result => {
    if (filterStatus === 'all') return true;
    return result.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0 };
    
    const completed = results.filter(r => r.status === 'Completed');
    if (completed.length === 0) return { average: 0, highest: 0, lowest: 0 };

    const percentages = completed.map(r => parseFloat(r.percentage));
    return {
      average: (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(2),
      highest: Math.max(...percentages).toFixed(2),
      lowest: Math.min(...percentages).toFixed(2),
    };
  };

  const stats = calculateStats();

  return (
    <div className="exam-results-container">
      <div className="results-header">
        <h2>Exam Results & Analytics</h2>
        <button className="btn-back" onClick={() => navigate('/teacher-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="results-content">
        {/* Exams List */}
        <div className="exams-panel">
          <h3>Your Exams</h3>
          <div className="exams-list">
            {loading ? (
              <p className="loading">Loading exams...</p>
            ) : exams.length === 0 ? (
              <p className="no-data">No exams created yet</p>
            ) : (
              exams.map(exam => (
                <div
                  key={exam._id}
                  className={`exam-card ${selectedExam?._id === exam._id ? 'active' : ''}`}
                  onClick={() => handleSelectExam(exam)}
                >
                  <div className="exam-card-header">
                    <h4>{exam.examName}</h4>
                    <span className="exam-count">{exam.studentCount}</span>
                  </div>
                  <p className="exam-subject">{exam.subject}</p>
                  <div className="exam-info">
                    <span>Q: {exam.totalQuestions}</span>
                    <span>M: {exam.totalMarks}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Results Details */}
        <div className="results-panel">
          {selectedExam ? (
            <>
              <div className="exam-title">
                <h3>{selectedExam.examName}</h3>
                <p>{selectedExam.subject}</p>
              </div>

              {/* Statistics */}
              <div className="stats-container">
                <div className="stat-box">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-value">{stats.average}%</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Highest Score</span>
                  <span className="stat-value">{stats.highest}%</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Lowest Score</span>
                  <span className="stat-value">{stats.lowest}%</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Total Submissions</span>
                  <span className="stat-value">{results.length}</span>
                </div>
              </div>

              {/* Filter */}
              <div className="filter-section">
                <label>Filter by Status:</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Submissions</option>
                  <option value="completed">Completed</option>
                  <option value="in progress">In Progress</option>
                </select>
              </div>

              {/* Results Table */}
              <div className="results-table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Status</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-data">No results found</td>
                      </tr>
                    ) : (
                      filteredResults.map(result => (
                        <tr key={result._id}>
                          <td className="student-name">{result.studentName}</td>
                          <td>{result.studentEmail}</td>
                          <td className="marks">
                            {result.marksObtained}/{result.totalMarks}
                          </td>
                          <td>
                            <span
                              className="percentage"
                              style={{ color: getPercentageColor(result.percentage) }}
                            >
                              {result.percentage}%
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(result.status)}`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="submitted-at">
                            {result.submittedAt
                              ? new Date(result.submittedAt).toLocaleDateString() +
                                ' ' +
                                new Date(result.submittedAt).toLocaleTimeString()
                              : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Select an exam to view results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
