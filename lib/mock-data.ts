// ============================================================
// Smart Factory 3D — Mock Data
// ============================================================

import { Device, DeviceAlert, SensorReading } from "./types";

// ---- Zones ----
export const ZONES = [
  "Zone A - Assembly",
  "Zone B - Packaging",
  "Zone C - Warehouse",
  "Zone D - Utilities",
] as const;

export const DEVICE_TYPES_META: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  temperature: { label: "Temperature", icon: "Thermometer", color: "#ef4444" },
  humidity: { label: "Humidity", icon: "Droplets", color: "#3b82f6" },
  pressure: { label: "Pressure", icon: "Gauge", color: "#8b5cf6" },
  vibration: { label: "Vibration", icon: "Activity", color: "#f59e0b" },
  power: { label: "Power", icon: "Zap", color: "#10b981" },
  flow: { label: "Flow", icon: "Waves", color: "#06b6d4" },
  level: { label: "Level", icon: "BarChart3", color: "#6366f1" },
  gas: { label: "Gas", icon: "Wind", color: "#ec4899" },
};

// ---- Mock Devices ----

export const mockDevices: Device[] = [
  {
    id: "dev-001",
    name: "Temperature Sensor A1",
    type: "temperature",
    description: "Main assembly line temperature monitoring",
    location: "Assembly Line 1, Column 3",
    zone: "Zone A - Assembly",
    status: "online",
    matterportTagId: "tag-temp-a1",
    sensors: [
      {
        id: "sen-001",
        name: "Ambient Temperature",
        type: "temperature",
        unit: "°C",
        currentValue: 24.5,
        min: 0,
        max: 60,
        thresholdWarning: 35,
        thresholdCritical: 45,
      },
      {
        id: "sen-002",
        name: "Surface Temperature",
        type: "temperature",
        unit: "°C",
        currentValue: 31.2,
        min: 0,
        max: 100,
        thresholdWarning: 60,
        thresholdCritical: 80,
      },
    ],
    createdAt: "2025-06-15T08:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-002",
    name: "Humidity Controller B1",
    type: "humidity",
    description: "Packaging area humidity control system",
    location: "Packaging Line 1, Bay 2",
    zone: "Zone B - Packaging",
    status: "online",
    matterportTagId: "tag-hum-b1",
    sensors: [
      {
        id: "sen-003",
        name: "Relative Humidity",
        type: "humidity",
        unit: "%RH",
        currentValue: 55.3,
        min: 0,
        max: 100,
        thresholdWarning: 70,
        thresholdCritical: 85,
      },
      {
        id: "sen-004",
        name: "Dew Point",
        type: "temperature",
        unit: "°C",
        currentValue: 14.8,
        min: -10,
        max: 40,
        thresholdWarning: 25,
        thresholdCritical: 30,
      },
    ],
    createdAt: "2025-07-01T09:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-003",
    name: "Vibration Monitor M3",
    type: "vibration",
    description: "Motor #3 vibration analysis sensor",
    location: "Assembly Line 2, Motor Bay",
    zone: "Zone A - Assembly",
    status: "warning",
    matterportTagId: "tag-vib-m3",
    sensors: [
      {
        id: "sen-005",
        name: "X-Axis Vibration",
        type: "vibration",
        unit: "mm/s",
        currentValue: 4.2,
        min: 0,
        max: 20,
        thresholdWarning: 4.0,
        thresholdCritical: 7.0,
      },
      {
        id: "sen-006",
        name: "Y-Axis Vibration",
        type: "vibration",
        unit: "mm/s",
        currentValue: 2.8,
        min: 0,
        max: 20,
        thresholdWarning: 4.0,
        thresholdCritical: 7.0,
      },
      {
        id: "sen-007",
        name: "Motor RPM",
        type: "rpm",
        unit: "RPM",
        currentValue: 1480,
        min: 0,
        max: 3000,
        thresholdWarning: 2500,
        thresholdCritical: 2800,
      },
    ],
    createdAt: "2025-08-10T10:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-004",
    name: "Power Meter Line 1",
    type: "power",
    description: "Main power consumption meter for assembly line 1",
    location: "Electrical Room, Panel A",
    zone: "Zone D - Utilities",
    status: "online",
    matterportTagId: "tag-pwr-l1",
    sensors: [
      {
        id: "sen-008",
        name: "Active Power",
        type: "power",
        unit: "kW",
        currentValue: 125.7,
        min: 0,
        max: 500,
        thresholdWarning: 350,
        thresholdCritical: 450,
      },
      {
        id: "sen-009",
        name: "Voltage",
        type: "voltage",
        unit: "V",
        currentValue: 398.2,
        min: 300,
        max: 500,
        thresholdWarning: 420,
        thresholdCritical: 440,
      },
      {
        id: "sen-010",
        name: "Current",
        type: "current",
        unit: "A",
        currentValue: 182.4,
        min: 0,
        max: 600,
        thresholdWarning: 450,
        thresholdCritical: 550,
      },
    ],
    createdAt: "2025-05-20T07:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-005",
    name: "Pressure Gauge P2",
    type: "pressure",
    description: "Compressed air system pressure monitoring",
    location: "Utility Room, Compressor Bay",
    zone: "Zone D - Utilities",
    status: "online",
    matterportTagId: "tag-prs-p2",
    sensors: [
      {
        id: "sen-011",
        name: "Air Pressure",
        type: "pressure",
        unit: "bar",
        currentValue: 6.8,
        min: 0,
        max: 12,
        thresholdWarning: 9,
        thresholdCritical: 10.5,
      },
    ],
    createdAt: "2025-09-05T11:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-006",
    name: "Gas Detector G1",
    type: "gas",
    description: "Warehouse gas leak detection system",
    location: "Warehouse Section C, Ceiling Mount",
    zone: "Zone C - Warehouse",
    status: "online",
    matterportTagId: "tag-gas-g1",
    sensors: [
      {
        id: "sen-012",
        name: "CO2 Level",
        type: "gas",
        unit: "ppm",
        currentValue: 420,
        min: 0,
        max: 5000,
        thresholdWarning: 1000,
        thresholdCritical: 2000,
      },
      {
        id: "sen-013",
        name: "CO Level",
        type: "gas",
        unit: "ppm",
        currentValue: 2.1,
        min: 0,
        max: 100,
        thresholdWarning: 25,
        thresholdCritical: 50,
      },
    ],
    createdAt: "2025-10-12T14:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-007",
    name: "Flow Meter F1",
    type: "flow",
    description: "Cooling water flow measurement",
    location: "Utility Room, Pipe Rack",
    zone: "Zone D - Utilities",
    status: "offline",
    matterportTagId: "tag-flw-f1",
    sensors: [
      {
        id: "sen-014",
        name: "Water Flow Rate",
        type: "flow",
        unit: "L/min",
        currentValue: 0,
        min: 0,
        max: 200,
        thresholdWarning: 150,
        thresholdCritical: 180,
      },
    ],
    createdAt: "2025-11-01T08:00:00Z",
    updatedAt: "2026-02-16T18:00:00Z",
  },
  {
    id: "dev-008",
    name: "Level Sensor L1",
    type: "level",
    description: "Chemical tank level monitoring",
    location: "Warehouse Section A, Tank Farm",
    zone: "Zone C - Warehouse",
    status: "online",
    matterportTagId: "tag-lvl-l1",
    sensors: [
      {
        id: "sen-015",
        name: "Tank Level",
        type: "level",
        unit: "%",
        currentValue: 72.5,
        min: 0,
        max: 100,
        thresholdWarning: 85,
        thresholdCritical: 95,
      },
    ],
    createdAt: "2025-11-15T09:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-009",
    name: "Temperature Sensor A2",
    type: "temperature",
    description: "Assembly Line 2 oven temperature",
    location: "Assembly Line 2, Oven Section",
    zone: "Zone A - Assembly",
    status: "critical",
    matterportTagId: "tag-temp-a2",
    sensors: [
      {
        id: "sen-016",
        name: "Oven Temperature",
        type: "temperature",
        unit: "°C",
        currentValue: 187.3,
        min: 0,
        max: 300,
        thresholdWarning: 180,
        thresholdCritical: 200,
      },
    ],
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
  {
    id: "dev-010",
    name: "Humidity Sensor B2",
    type: "humidity",
    description: "Packaging area ambient humidity",
    location: "Packaging Line 2, Station 5",
    zone: "Zone B - Packaging",
    status: "online",
    matterportTagId: "tag-hum-b2",
    sensors: [
      {
        id: "sen-017",
        name: "Ambient Humidity",
        type: "humidity",
        unit: "%RH",
        currentValue: 48.7,
        min: 0,
        max: 100,
        thresholdWarning: 70,
        thresholdCritical: 85,
      },
      {
        id: "sen-018",
        name: "Ambient Temperature",
        type: "temperature",
        unit: "°C",
        currentValue: 23.1,
        min: 0,
        max: 60,
        thresholdWarning: 35,
        thresholdCritical: 45,
      },
    ],
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-02-17T10:30:00Z",
  },
];

// ---- Mock Alerts ----

export const mockAlerts: DeviceAlert[] = [
  {
    id: "alert-001",
    deviceId: "dev-009",
    deviceName: "Temperature Sensor A2",
    sensorId: "sen-016",
    sensorName: "Oven Temperature",
    message: "Oven temperature approaching critical threshold",
    severity: "warning",
    value: 187.3,
    threshold: 180,
    timestamp: Date.now() - 5 * 60 * 1000,
    acknowledged: false,
  },
  {
    id: "alert-002",
    deviceId: "dev-003",
    deviceName: "Vibration Monitor M3",
    sensorId: "sen-005",
    sensorName: "X-Axis Vibration",
    message: "X-Axis vibration exceeded warning level",
    severity: "warning",
    value: 4.2,
    threshold: 4.0,
    timestamp: Date.now() - 12 * 60 * 1000,
    acknowledged: false,
  },
  {
    id: "alert-003",
    deviceId: "dev-007",
    deviceName: "Flow Meter F1",
    sensorId: "sen-014",
    sensorName: "Water Flow Rate",
    message: "Device offline - no data received",
    severity: "critical",
    value: 0,
    threshold: 0,
    timestamp: Date.now() - 30 * 60 * 1000,
    acknowledged: false,
  },
  {
    id: "alert-004",
    deviceId: "dev-006",
    deviceName: "Gas Detector G1",
    sensorId: "sen-012",
    sensorName: "CO2 Level",
    message: "CO2 level slightly elevated",
    severity: "info",
    value: 420,
    threshold: 1000,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    acknowledged: true,
  },
  {
    id: "alert-005",
    deviceId: "dev-004",
    deviceName: "Power Meter Line 1",
    sensorId: "sen-008",
    sensorName: "Active Power",
    message: "Power consumption spike detected",
    severity: "info",
    value: 125.7,
    threshold: 350,
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    acknowledged: true,
  },
  {
    id: "alert-006",
    deviceId: "dev-009",
    deviceName: "Temperature Sensor A2",
    sensorId: "sen-016",
    sensorName: "Oven Temperature",
    message: "Oven temperature exceeded critical threshold",
    severity: "critical",
    value: 202.5,
    threshold: 200,
    timestamp: Date.now() - 1 * 60 * 1000,
    acknowledged: false,
  },
];

// ---- Generate initial historical readings ----

export function generateHistoricalReadings(
  deviceId: string,
  sensorId: string,
  baseValue: number,
  variance: number,
  count: number = 60,
  intervalMs: number = 5000,
): SensorReading[] {
  const now = Date.now();
  const readings: SensorReading[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const jitter = (Math.random() - 0.5) * 2 * variance;
    readings.push({
      sensorId,
      deviceId,
      value: Math.round((baseValue + jitter) * 100) / 100,
      timestamp: now - i * intervalMs,
    });
  }

  return readings;
}

// ---- Build initial readings map ----

export function buildInitialReadings(): Map<string, SensorReading[]> {
  const map = new Map<string, SensorReading[]>();

  for (const device of mockDevices) {
    for (const sensor of device.sensors) {
      const variance =
        sensor.type === "temperature"
          ? 2
          : sensor.type === "humidity"
            ? 3
            : sensor.type === "vibration"
              ? 0.5
              : sensor.type === "power"
                ? 15
                : sensor.type === "voltage"
                  ? 5
                  : sensor.type === "current"
                    ? 10
                    : sensor.type === "pressure"
                      ? 0.3
                      : sensor.type === "rpm"
                        ? 50
                        : sensor.type === "gas"
                          ? 20
                          : sensor.type === "flow"
                            ? 5
                            : sensor.type === "level"
                              ? 2
                              : 1;

      map.set(
        sensor.id,
        generateHistoricalReadings(
          device.id,
          sensor.id,
          sensor.currentValue,
          variance,
          60,
          5000,
        ),
      );
    }
  }

  return map;
}
