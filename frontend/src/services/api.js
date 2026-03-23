const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const buildApiUrl = (path = "") =>
  API_BASE_URL
    ? `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
    : path.startsWith("/")
      ? path
      : `/${path}`;

export const apiFetch = async (path, options = {}) => {
  const { token, headers = {}, ...rest } = options;
  const requestHeaders = { ...headers };

  if (rest.body && !(rest.body instanceof FormData) && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    ...rest,
    headers: requestHeaders,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.msg ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.response = { status: response.status, data };
    throw error;
  }

  return data;
};
