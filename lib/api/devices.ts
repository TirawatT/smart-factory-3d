import { apiClient } from "./client";
import { Device, DeviceFormData } from "@/lib/types";

export interface DevicesQuery {
  site_id?: string;
  status?: string;
  zone?: string;
  search?: string;
}

export interface ControlCommand {
  deviceId: string;
  command: "start" | "stop" | "restart" | "adjust";
  params?: Record<string, unknown>;
}

export const devicesApi = {
  list: (params?: DevicesQuery) =>
    apiClient.get<Device[]>("/devices", { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Device>(`/devices/${id}`).then((r) => r.data),

  create: (data: DeviceFormData) =>
    apiClient.post<Device>("/devices", data).then((r) => r.data),

  update: (id: string, data: Partial<DeviceFormData>) =>
    apiClient.patch<Device>(`/devices/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/devices/${id}`).then((r) => r.data),

  control: (cmd: ControlCommand) =>
    apiClient.post("/devices/control", cmd).then((r) => r.data),

  telemetry: (deviceId: string, params?: { from?: number; to?: number; limit?: number }) =>
    apiClient.get<Array<{ sensorId: string; value: number; timestamp: number }>>(
      `/devices/${deviceId}/telemetry`, { params }
    ).then((r) => r.data),
};
