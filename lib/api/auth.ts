import { apiClient } from "./client";

export interface LoginPayload { email: string; password: string; }
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    permissions: string[];
    modules: string[];
  };
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login", data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient.post<{ token: string; refreshToken: string }>("/auth/refresh", { refreshToken }).then((r) => r.data),

  logout: () =>
    apiClient.post("/auth/logout").then((r) => r.data),

  me: () =>
    apiClient.get<LoginResponse["user"]>("/auth/me").then((r) => r.data),
};
