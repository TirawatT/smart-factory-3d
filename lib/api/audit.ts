import { apiClient } from "./client";

export interface AuditLog {
  id: string;
  timestamp: number;
  user: string;
  role: string;
  action: string;
  resource: string;
  result: "success" | "failure";
  ip: string;
  detail: string;
}

export interface AuditQuery {
  search?: string;
  result?: "success" | "failure";
  from?: number;
  to?: number;
  limit?: number;
  page?: number;
}

export const auditApi = {
  list: (params?: AuditQuery) =>
    apiClient.get<AuditLog[]>("/audit", { params }).then((r) => r.data),

  export: (params?: AuditQuery) =>
    apiClient.get("/audit/export", { params, responseType: "blob" }).then((r) => r.data),
};
