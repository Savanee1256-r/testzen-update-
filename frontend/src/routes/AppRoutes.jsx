import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import ExamAttempt from "../pages/ExamAttempt";
import CreateExam from "../pages/createexam/CreateExam";
import Result from "../pages/Result";
import { getRole, getToken } from "../utils/auth";

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student/dashboard"
        element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />}
      />
      <Route
        path="/teacher/dashboard"
        element={<ProtectedRoute element={<TeacherDashboard />} requiredRole="teacher" />}
      />
      <Route
        path="/teacher/create-exam"
        element={<ProtectedRoute element={<CreateExam />} requiredRole="teacher" />}
      />
      <Route
        path="/exam/attempt/:examId"
        element={<ProtectedRoute element={<ExamAttempt />} requiredRole="student" />}
      />
      <Route
        path="/exam/result/:resultId"
        element={<ProtectedRoute element={<Result />} requiredRole="student" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
