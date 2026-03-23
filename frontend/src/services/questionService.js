import { apiFetch } from "./api";

export const getQuestionsByExamId = (examId, token = localStorage.getItem("token")) =>
  apiFetch(`/exams/${examId}/questions`, { token });
