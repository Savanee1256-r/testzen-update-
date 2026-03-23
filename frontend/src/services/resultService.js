import { apiFetch } from "./api";

export const getResultById = (resultId, token = localStorage.getItem("token")) =>
  apiFetch(`/results/${resultId}`, { token });
