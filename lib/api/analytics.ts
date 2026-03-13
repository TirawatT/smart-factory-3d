import { apiClient } from "./client";

export interface OeeDataPoint {
  date: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface ProductionDataPoint {
  date: string;
  target: number;
  actual: number;
}

export interface EnergyDataPoint {
  date: string;
  peak: number;
  offPeak: number;
  cost: number;
}

export interface DashboardKPIs {
  totalDevices: number;
  onlineDevices: number;
  activeAlerts: number;
  criticalAlerts: number;
  oee: number;
  production: number;
  energyToday: number;
  uptimePct: number;
}

export const analyticsApi = {
  kpis: (siteId?: string) =>
    apiClient.get<DashboardKPIs>("/analytics/kpis", { params: { siteId } }).then((r) => r.data),

  oee: (params?: { days?: number; siteId?: string }) =>
    apiClient.get<OeeDataPoint[]>("/analytics/oee", { params }).then((r) => r.data),

  production: (params?: { days?: number }) =>
    apiClient.get<ProductionDataPoint[]>("/analytics/production", { params }).then((r) => r.data),

  energy: (params?: { days?: number }) =>
    apiClient.get<EnergyDataPoint[]>("/analytics/energy", { params }).then((r) => r.data),

  downtimeCauses: () =>
    apiClient.get<Array<{ cause: string; minutes: number; pct: number }>>("/analytics/downtime").then((r) => r.data),

  topConsumers: () =>
    apiClient.get<Array<{ device: string; kwh: number; cost: number }>>("/analytics/top-consumers").then((r) => r.data),
};
