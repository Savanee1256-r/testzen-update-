import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchStudents } from "../../services/examService";

export default function Students() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        if (!token) return;
        
        const studentsData = await fetchStudents(token);
        setStudents(Array.isArray(studentsData?.students) ? studentsData.students : []);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading students...</span>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="dashboard__page-header">
        <h1 className="dashboard__page-title">Students</h1>
        <p className="dashboard__page-sub">View and manage enrolled students</p>
      </div>

      <div className="card">
        <div className="students-list">
          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No students enrolled</h3>
              <p>Students will appear here once they register for the system.</p>
            </div>
          ) : (
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id || index}>
                      <td>{student.name || "N/A"}</td>
                      <td>{student.email || "N/A"}</td>
                      <td>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <span className="status-badge active">Active</span>
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
