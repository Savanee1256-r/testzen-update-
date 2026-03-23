import { apiFetch } from "./api";

export const submitExam = (data, token = localStorage.getItem("token")) =>
  apiFetch("/submissions", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
