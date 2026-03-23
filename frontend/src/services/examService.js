import { apiFetch } from "./api";

export const fetchExams = (token) => apiFetch("/exams", { token });
export const fetchExamById = (id, token) => apiFetch(`/exams/${id}`, { token });
export const createExam = (payload, token) =>
  apiFetch("/exams", { method: "POST", body: JSON.stringify(payload), token });
export const updateExam = (id, payload, token) =>
  apiFetch(`/exams/${id}`, { method: "PUT", body: JSON.stringify(payload), token });
export const publishExam = (id, token) =>
  apiFetch(`/exams/${id}/publish`, { method: "PUT", token });
export const deleteExam = (id, token) =>
  apiFetch(`/exams/${id}`, { method: "DELETE", token });

export const fetchSubmissions = (token) => apiFetch("/submissions", { token });
export const fetchMySubmissions = (token) => apiFetch("/submissions/my", { token });
export const fetchSubmissionById = (id, token) => apiFetch(`/submissions/${id}`, { token });
export const submitExam = (payload, token) =>
  apiFetch("/submissions", { method: "POST", body: JSON.stringify(payload), token });
export const gradeSubmission = (id, payload, token) =>
  apiFetch(`/submissions/${id}/grade`, { method: "PUT", body: JSON.stringify(payload), token });

export const publishResult = (id, token) =>
  apiFetch(`/results/publish/${id}`, { method: "PUT", token });
export const fetchExamResults = (examId, token) =>
  apiFetch(`/results/exam/${examId}`, { token });
export const fetchMyResults = (token) => apiFetch("/results/my", { token });

export const fetchStudents = (token) => apiFetch("/users/students", { token });
export const fetchStudentById = (id, token) => apiFetch(`/users/students/${id}`, { token });
export const fetchProfile = (token) => apiFetch("/users/profile", { token });
export const updateProfile = (payload, token) =>
  apiFetch("/users/profile", { method: "PUT", body: JSON.stringify(payload), token });
