import { apiClient } from "./client";
import { DeviceAlert } from "@/lib/types";

export interface AlertsQuery {
  status?: "active" | "acknowledged" | "all";
  severity?: string;
  deviceId?: string;
  page?: number;
  limit?: number;
}

export const alertsApi = {
  list: (params?: AlertsQuery) =>
    apiClient.get<DeviceAlert[]>("/alerts", { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<DeviceAlert>(`/alerts/${id}`).then((r) => r.data),

  acknowledge: (id: string) =>
    apiClient.patch<DeviceAlert>(`/alerts/${id}/acknowledge`).then((r) => r.data),

  acknowledgeAll: () =>
    apiClient.post("/alerts/acknowledge-all").then((r) => r.data),

  resolve: (id: string) =>
    apiClient.patch<DeviceAlert>(`/alerts/${id}/resolve`).then((r) => r.data),
};
