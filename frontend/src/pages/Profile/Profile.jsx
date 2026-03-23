import "./Profile.css";
import { useAuth } from "../../context/AuthContext";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function Profile() {
  const { student } = useAuth();

  return (
    <div className="profile">
      {/* Hero Banner */}
      <div className="profile__hero">
        <div className="profile__avatar">{getInitials(student?.name)}</div>
        <div className="profile__hero-info">
          <div className="profile__role-badge">🎓 Student</div>
          <h2 className="profile__name">{student?.name}</h2>
          <p className="profile__email">{student?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile__card" style={{ marginBottom: "1.2rem" }}>
        <div className="profile__stats">
          <div className="profile__stat">
            <span className="profile__stat-value">4</span>
            <span className="profile__stat-label">Exams Done</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">82%</span>
            <span className="profile__stat-label">Avg Score</span>
          </div>
          <div className="profile__stat">
            <span className="profile__stat-value">3</span>
            <span className="profile__stat-label">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="profile__grid">
        {/* Academic Info */}
        <div className="profile__card">
          <div className="profile__card-title">🏫 Academic Details</div>
          <div className="profile__fields">
            <div className="profile__field">
              <span className="profile__field-label">Enrollment No.</span>
              <span className="profile__field-value">{student?.enrollmentNo}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Department</span>
              <span className="profile__field-value">{student?.department}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Semester</span>
              <span className="profile__field-value">{student?.semester}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Joined On</span>
              <span className="profile__field-value">{formatDate(student?.joinedAt)}</span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="profile__card">
          <div className="profile__card-title">📋 Personal Details</div>
          <div className="profile__fields">
            <div className="profile__field">
              <span className="profile__field-label">Full Name</span>
              <span className="profile__field-value">{student?.name}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Email Address</span>
              <span className="profile__field-value">{student?.email}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Phone</span>
              <span className="profile__field-value">{student?.phone || "—"}</span>
            </div>
            <div className="profile__field">
              <span className="profile__field-label">Role</span>
              <span className="profile__field-value" style={{ textTransform: "capitalize" }}>
                {student?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
