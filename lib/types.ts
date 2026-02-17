// ============================================================
// Smart Factory 3D — Core Type Definitions
// ============================================================

export type DeviceType =
  | "temperature"
  | "humidity"
  | "pressure"
  | "vibration"
  | "power"
  | "flow"
  | "level"
  | "gas";

export type DeviceStatus = "online" | "offline" | "warning" | "critical";

export type SensorType =
  | "temperature"
  | "humidity"
  | "pressure"
  | "vibration"
  | "power"
  | "flow"
  | "level"
  | "gas"
  | "rpm"
  | "voltage"
  | "current";

export type AlertSeverity = "critical" | "warning" | "info";

// ---- Device & Sensor ----

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  unit: string;
  currentValue: number;
  min: number;
  max: number;
  thresholdWarning: number;
  thresholdCritical: number;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  description: string;
  location: string;
  zone: string;
  status: DeviceStatus;
  matterportTagId: string | null;
  sensors: Sensor[];
  createdAt: string; // ISO date string
  updatedAt: string;
}

// ---- Sensor Reading (time-series) ----

export interface SensorReading {
  sensorId: string;
  deviceId: string;
  value: number;
  timestamp: number; // epoch ms
}

// ---- Alerts ----

export interface DeviceAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  sensorId: string;
  sensorName: string;
  message: string;
  severity: AlertSeverity;
  value: number;
  threshold: number;
  timestamp: number;
  acknowledged: boolean;
}

// ---- Matterport Integration ----

export interface MatterportConfig {
  url: string;
  enabled: boolean;
}

export interface MatterportTagEvent {
  tagId: string;
  action: "click" | "hover";
}

// ---- Form types for CRUD ----

export interface DeviceFormData {
  name: string;
  type: DeviceType;
  description: string;
  location: string;
  zone: string;
  matterportTagId: string;
  sensors: Omit<Sensor, "id" | "currentValue">[];
}

// ---- Chart data ----

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

// ---- Dashboard stats ----

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeAlerts: number;
  criticalAlerts: number;
}
