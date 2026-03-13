import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach token ────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("sf-auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token as string | undefined;
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // ignore
      }
    }
  }
  return config;
});

// ── Response interceptor: handle 401 ─────────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const raw = localStorage.getItem("sf-auth");
        const refreshToken = raw ? JSON.parse(raw)?.state?.refreshToken : null;
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          original.headers.Authorization = `Bearer ${data.token}`;
          // Persist new tokens
          const stored = JSON.parse(localStorage.getItem("sf-auth") ?? "{}");
          stored.state = { ...stored.state, token: data.token, refreshToken: data.refreshToken };
          localStorage.setItem("sf-auth", JSON.stringify(stored));
          return apiClient(original);
        }
      } catch {
        // refresh failed → redirect to login
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
