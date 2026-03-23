import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";
import examLogo from "../../assets/examLogo.jpeg";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STUDENT_NAV_ITEMS = [
  { id: "profile", label: "My Profile", icon: String.fromCodePoint(0x1F464) },
  { id: "exams", label: "Examinations", icon: String.fromCodePoint(0x1F4DD) },
  { id: "results", label: "Results", icon: String.fromCodePoint(0x1F4CA) },
];

const TEACHER_NAV_ITEMS = [
  { id: "home", label: "Home", icon: String.fromCodePoint(0x1F3E0) },
  { id: "create-exam", label: "Create Exam", icon: String.fromCodePoint(0x2795) },
  { id: "submissions", label: "Submissions", icon: String.fromCodePoint(0x1F4CB) },
  { id: "results", label: "Results", icon: String.fromCodePoint(0x1F4CA) },
  { id: "students", label: "Students", icon: String.fromCodePoint(0x1F393) },
  { id: "profile", label: "Profile", icon: String.fromCodePoint(0x1F464) },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose, role }) {
  const { user, student, logout } = useAuth();
  const currentRole = role || user?.role || "student";
  const currentUser = currentRole === "teacher" ? user : student;
  const navItems = currentRole === "teacher" ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS;
  const roleLabel = currentRole === "teacher" ? "Teacher" : "Student";

  const handleNav = (id) => {
    onNavigate(id);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}

      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <img src={examLogo} alt="TestZen Logo" />
          </div>

          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">TESTZEN</span>
            <span className="sidebar__brand-sub">Exam Management System</span>
          </div>
        </div>

        <div className="sidebar__student">
          <div className="sidebar__student-avatar">{getInitials(currentUser?.name)}</div>
          <div className="sidebar__student-info">
            <div className="sidebar__student-name">{currentUser?.name || roleLabel}</div>
            <div className="sidebar__student-role">{roleLabel}</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <span className="sidebar__section-label">Menu</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__nav-item${activePage === item.id ? " active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={handleLogout}>
            <span className="sidebar__logout-icon">{String.fromCodePoint(0x1F6AA)}</span>
            <span className="sidebar__logout-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
