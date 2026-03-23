import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import "../../src/styles/layout.css";

export default function DashboardShell({ activePage, onNavigate, role, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        role={role}
        activePage={activePage}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="layout__main">
        <Navbar
          role={role}
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
        />
        <main className="layout__content">{children}</main>
      </div>
    </div>
  );
}
