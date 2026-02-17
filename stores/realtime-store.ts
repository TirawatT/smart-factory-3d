// ============================================================
// Smart Factory 3D — Zustand Store: Realtime Data + Alerts
// ============================================================

import { buildInitialReadings, mockAlerts } from "@/lib/mock-data";
import { DeviceAlert, SensorReading } from "@/lib/types";
import { create } from "zustand";

const MAX_READINGS_PER_SENSOR = 120;

interface RealtimeStore {
  // Sensor time-series data
  readings: Map<string, SensorReading[]>;

  // Alerts
  alerts: DeviceAlert[];

  // Selection (used in Digital Twin page)
  selectedDeviceId: string | null;

  // Simulation
  isSimulating: boolean;

  // Actions
  pushReading: (reading: SensorReading) => void;
  getReadings: (sensorId: string) => SensorReading[];
  addAlert: (alert: DeviceAlert) => void;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  setSelectedDeviceId: (id: string | null) => void;
  setSimulating: (v: boolean) => void;
  getUnacknowledgedCount: () => number;
}

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
  readings: buildInitialReadings(),
  alerts: [...mockAlerts],
  selectedDeviceId: null,
  isSimulating: false,

  pushReading: (reading) => {
    set((state) => {
      const newMap = new Map(state.readings);
      const arr = [...(newMap.get(reading.sensorId) || []), reading];
      // Keep only the last N readings
      if (arr.length > MAX_READINGS_PER_SENSOR) {
        arr.splice(0, arr.length - MAX_READINGS_PER_SENSOR);
      }
      newMap.set(reading.sensorId, arr);
      return { readings: newMap };
    });
  },

  getReadings: (sensorId) => {
    return get().readings.get(sensorId) || [];
  },

  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 50), // keep max 50
    }));
  },

  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a,
      ),
    }));
  },

  dismissAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),

  setSimulating: (v) => set({ isSimulating: v }),

  getUnacknowledgedCount: () => {
    return get().alerts.filter((a) => !a.acknowledged).length;
  },
}));
