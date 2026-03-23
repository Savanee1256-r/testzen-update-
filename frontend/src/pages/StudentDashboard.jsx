import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Profile from "./Profile/Profile";
import Exams from "./Exams/Exams";
import Results from "./Results/Results";
import ExamAttempt from "./ExamAttempt";
import "../styles/dashboard.css";
import "../styles/Global.css";

const PAGE_META = {
  profile: {
    title: "My Profile",
    sub: "View and manage your personal & academic information",
  },
  exams: {
    title: "Examinations",
    sub: "Current exams, notices, and your submitted exam history",
  },
  results: {
    title: "My Results",
    sub: "Detailed scorecard and performance overview",
  },
};

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attemptingExam, setAttemptingExam] = useState(null);

  const meta = PAGE_META[activePage];

  const handleAttemptExam = (exam) => {
    setAttemptingExam(exam);
  };

  const handleExamComplete = () => {
    setAttemptingExam(null);
    setActivePage("exams"); // Return to exams page
  };

  if (attemptingExam) {
    return (
      <div className="dashboard">
        <ExamAttempt exam={attemptingExam} onComplete={handleExamComplete} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard__main">
        <Navbar
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />

        <main className="dashboard__content">
          <div className="dashboard__page-header">
            <h2 className="dashboard__page-title">{meta.title}</h2>
            <p className="dashboard__page-sub">{meta.sub}</p>
          </div>

          {activePage === "profile" && <Profile />}
          {activePage === "exams"   && <Exams onAttemptExam={handleAttemptExam} />}
          {activePage === "results" && <Results />}
        </main>
      </div>
    </div>
  );
}
