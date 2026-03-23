const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const USER_KEY = "user";

export const normalizeRole = (role) =>
  String(role || "").toLowerCase() === "teacher" ? "teacher" : "student";

export const normalizeUser = (user) => {
  if (!user) return null;

  const firstname = user.fullname?.firstname || "";
  const lastname = user.fullname?.lastname || "";
  const name = user.name || [firstname, lastname].filter(Boolean).join(" ").trim();

  return {
    ...user,
    name,
    email: user.email || "",
    role: normalizeRole(user.role),
    joinedAt: user.joinedAt || user.createdAt,
    createdAt: user.createdAt || user.joinedAt,
  };
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setRole = (role) => {
  localStorage.setItem(ROLE_KEY, normalizeRole(role));
};

export const getRole = () => {
  const role = localStorage.getItem(ROLE_KEY);
  return role ? normalizeRole(role) : null;
};

export const setUser = (user) => {
  const normalized = normalizeUser(user);
  if (!normalized) return;

  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
  setRole(normalized.role);
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};
