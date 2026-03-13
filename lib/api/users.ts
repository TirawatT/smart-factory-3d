import { apiClient } from "./client";
import { UserRole } from "@/stores/auth-store";

export interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string;
  sites: string[];
}

export interface CreateUserPayload {
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  password?: string;
}

export const usersApi = {
  list: () =>
    apiClient.get<UserRecord[]>("/users").then((r) => r.data),

  get: (id: string) =>
    apiClient.get<UserRecord>(`/users/${id}`).then((r) => r.data),

  create: (data: CreateUserPayload) =>
    apiClient.post<UserRecord>("/users", data).then((r) => r.data),

  update: (id: string, data: Partial<CreateUserPayload>) =>
    apiClient.patch<UserRecord>(`/users/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`).then((r) => r.data),
};
