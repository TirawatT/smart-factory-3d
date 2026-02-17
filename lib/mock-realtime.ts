// ============================================================
// Smart Factory 3D — Real-time Simulator (Mock)
// ============================================================
// Generates fake sensor readings periodically to simulate
// real IoT data flow. Replace with MQTT/WebSocket in production.

import { DeviceAlert, SensorReading } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";

let intervalId: ReturnType<typeof setInterval> | null = null;
let alertCounter = 100;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function tick() {
  const devices = useDeviceStore.getState().devices;
  const { pushReading, addAlert } = useRealtimeStore.getState();
  const { updateSensorValue, updateDeviceStatus } = useDeviceStore.getState();

  const now = Date.now();

  for (const device of devices) {
    // Skip offline devices
    if (device.status === "offline") continue;

    for (const sensor of device.sensors) {
      // Random walk around current value
      const range = sensor.max - sensor.min;
      const noise = (Math.random() - 0.5) * range * 0.02; // 2% noise
      const drift = (Math.random() - 0.5) * range * 0.005; // 0.5% drift
      let newValue = sensor.currentValue + noise + drift;

      // Clamp to min/max
      newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
      newValue = Math.round(newValue * 100) / 100;

      // Update sensor current value in device store
      updateSensorValue(device.id, sensor.id, newValue);

      // Push reading to realtime store
      const reading: SensorReading = {
        sensorId: sensor.id,
        deviceId: device.id,
        value: newValue,
        timestamp: now,
      };
      pushReading(reading);

      // Check thresholds and generate alerts (with some probability)
      if (newValue >= sensor.thresholdCritical && Math.random() < 0.1) {
        alertCounter++;
        const alert: DeviceAlert = {
          id: `alert-gen-${alertCounter}`,
          deviceId: device.id,
          deviceName: device.name,
          sensorId: sensor.id,
          sensorName: sensor.name,
          message: `${sensor.name} exceeded critical threshold (${newValue} ${sensor.unit} > ${sensor.thresholdCritical} ${sensor.unit})`,
          severity: "critical",
          value: newValue,
          threshold: sensor.thresholdCritical,
          timestamp: now,
          acknowledged: false,
        };
        addAlert(alert);
        updateDeviceStatus(device.id, "critical");
      } else if (newValue >= sensor.thresholdWarning && Math.random() < 0.05) {
        alertCounter++;
        const alert: DeviceAlert = {
          id: `alert-gen-${alertCounter}`,
          deviceId: device.id,
          deviceName: device.name,
          sensorId: sensor.id,
          sensorName: sensor.name,
          message: `${sensor.name} exceeded warning threshold (${newValue} ${sensor.unit} > ${sensor.thresholdWarning} ${sensor.unit})`,
          severity: "warning",
          value: newValue,
          threshold: sensor.thresholdWarning,
          timestamp: now,
          acknowledged: false,
        };
        addAlert(alert);
        if (device.status === "online") {
          updateDeviceStatus(device.id, "warning");
        }
      }
    }
  }
}

export function startSimulation(intervalMs: number = 3000) {
  if (intervalId) return; // already running

  useRealtimeStore.getState().setSimulating(true);
  intervalId = setInterval(tick, intervalMs);
  // Run first tick immediately
  tick();
}

export function stopSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  useRealtimeStore.getState().setSimulating(false);
}

export function isSimulationRunning() {
  return intervalId !== null;
}
