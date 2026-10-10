// Thin wrapper around the aktiv Server API.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const KEY = "aktiv_token";

export const getToken = () => localStorage.getItem(KEY);
const setToken = (t) => localStorage.setItem(KEY, t);
const clearToken = () => localStorage.removeItem(KEY);

const API_URL = import.meta.env.VITE_API_URL;
export default API_URL;

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Check that it's running and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Try again.");
  return data;
}

export const api = {
  async login(creds) {
    const data = await request("/auth/login", { method: "POST", body: creds });
    setToken(data.token);
    return data.user;
  },
  async signup(info) {
    const data = await request("/auth/signup", { method: "POST", body: info });
    setToken(data.token);
    return data.user;
  },
  logout: clearToken,
  me: () => request("/user/me"),
  updateMe: (patch) => request("/user/me", { method: "PUT", body: patch }),
  updateNotifications: (prefs) => request("/user/notifications", { method: "PUT", body: prefs }),
  async deleteAccount(password) {
    await request("/user/me", { method: "DELETE", body: { password } });
    clearToken();
  },
  getProgress: () => request("/progress"),
  saveProgress: (activityId, payload) => request(`/progress/${activityId}`, { method: "PUT", body: payload }),
};
