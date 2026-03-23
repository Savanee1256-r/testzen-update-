import { apiFetch } from "./api";

export const loginUser = (data) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerUser = (data) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
