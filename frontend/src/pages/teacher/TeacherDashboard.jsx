import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";

import TeacherHome from "./TeacherHome";
import Students from "./Students";
import Submissions from "./Submissions";
import TeacherProfile from "./TeacherProfile";
import Results from "./result";

export default function TeacherDashboard() {
  const [page, setPage] = useState("home");
  const navigate = useNavigate();

  const handleNavigation = (pageId) => {
    if (pageId === "create-exam") {
      navigate("/teacher/create-exam");
    } else {
      setPage(pageId);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "students":
        return <Students />;
      case "submissions":
        return <Submissions />;
      case "profile":
        return <TeacherProfile />;
      case "results":
        return <Results />;
      default:
        return <TeacherHome onNavigate={setPage} />;
    }
  };

  return (
    <DashboardShell role="teacher" activePage={page} onNavigate={handleNavigation}>
      {renderPage()}
    </DashboardShell>
  );
}
