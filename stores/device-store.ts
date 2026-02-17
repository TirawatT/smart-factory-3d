// ============================================================
// Smart Factory 3D — Zustand Store: Devices CRUD
// ============================================================

import { mockDevices } from "@/lib/mock-data";
import { Device, DeviceFormData, DeviceStatus } from "@/lib/types";
import { create } from "zustand";

interface DeviceStore {
  devices: Device[];

  // Getters
  getDeviceById: (id: string) => Device | undefined;
  getDevicesByZone: (zone: string) => Device[];
  getDevicesByStatus: (status: DeviceStatus) => Device[];
  getDeviceByTagId: (tagId: string) => Device | undefined;

  // Mutations
  addDevice: (data: DeviceFormData) => Device;
  updateDevice: (id: string, data: Partial<DeviceFormData>) => void;
  deleteDevice: (id: string) => void;
  updateDeviceStatus: (id: string, status: DeviceStatus) => void;
  updateSensorValue: (
    deviceId: string,
    sensorId: string,
    value: number,
  ) => void;
}

let counter = 100;
function genId(prefix: string) {
  counter++;
  return `${prefix}-${counter.toString().padStart(3, "0")}`;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [...mockDevices],

  getDeviceById: (id) => get().devices.find((d) => d.id === id),

  getDevicesByZone: (zone) => get().devices.filter((d) => d.zone === zone),

  getDevicesByStatus: (status) =>
    get().devices.filter((d) => d.status === status),

  getDeviceByTagId: (tagId) =>
    get().devices.find((d) => d.matterportTagId === tagId),

  addDevice: (data) => {
    const now = new Date().toISOString();
    const newDevice: Device = {
      id: genId("dev"),
      name: data.name,
      type: data.type,
      description: data.description,
      location: data.location,
      zone: data.zone,
      status: "online",
      matterportTagId: data.matterportTagId || null,
      sensors: data.sensors.map((s, i) => ({
        ...s,
        id: genId("sen"),
        currentValue: (s.min + s.max) / 2,
      })),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ devices: [...state.devices, newDevice] }));
    return newDevice;
  },

  updateDevice: (id, data) => {
    set((state) => ({
      devices: state.devices.map((d) => {
        if (d.id !== id) return d;

        const updated: Device = {
          ...d,
          ...(data.name !== undefined && { name: data.name }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.location !== undefined && { location: data.location }),
          ...(data.zone !== undefined && { zone: data.zone }),
          ...(data.matterportTagId !== undefined && {
            matterportTagId: data.matterportTagId || null,
          }),
          ...(data.sensors !== undefined && {
            sensors: data.sensors.map((s) => ({
              ...s,
              id: genId("sen"),
              currentValue: (s.min + s.max) / 2,
            })),
          }),
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }),
    }));
  },

  deleteDevice: (id) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
    }));
  },

  updateDeviceStatus: (id, status) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d,
      ),
    }));
  },

  updateSensorValue: (deviceId, sensorId, value) => {
    set((state) => ({
      devices: state.devices.map((d) => {
        if (d.id !== deviceId) return d;
        return {
          ...d,
          sensors: d.sensors.map((s) =>
            s.id === sensorId ? { ...s, currentValue: value } : s,
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
}));
