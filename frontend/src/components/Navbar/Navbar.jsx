import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STUDENT_TITLES = {
  profile: "My Profile",
  exams: "Examinations",
  results: "My Results",
};

const TEACHER_TITLES = {
  home: "Teacher Dashboard",
  "create-exam": "Create Exam",
  submissions: "Submissions",
  results: "Exam Results",
  students: "Students",
  profile: "Teacher Profile",
};

export default function Navbar({ onMenuToggle, activePage, role }) {
  const { user, student, logout } = useAuth();
  const navigate = useNavigate();
  const currentRole = role || user?.role || "student";
  const currentUser = currentRole === "teacher" ? user : student;
  const pageTitles = currentRole === "teacher" ? TEACHER_TITLES : STUDENT_TITLES;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="navbar__title">{pageTitles[activePage] || "Dashboard"}</h1>
      </div>

      <div className="navbar__right">
        <span className="navbar__date">{formatDate()}</span>

        <button className="navbar__notif" title="Notifications">
          {String.fromCodePoint(0x1F514)}
          <span className="navbar__notif-badge" />
        </button>

        <div className="navbar__avatar" title={currentUser?.name} onClick={handleLogout}>
          {getInitials(currentUser?.name)}
        </div>
      </div>
    </header>
  );
}
