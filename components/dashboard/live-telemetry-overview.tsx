"use client";

import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { useDevices, useDeviceTelemetry } from "@/lib/hooks/use-devices";
import { useLiveTelemetry } from "@/lib/hooks/use-live-telemetry";
import { useMqttStatus } from "@/lib/websocket/use-mqtt";
import { SensorReading } from "@/lib/types";
import { Activity, Wifi, WifiOff } from "lucide-react";

// ---------------------------------------------------------------------------
// Sub-component: sensor chart with MQTT live data + API polling fallback
// ---------------------------------------------------------------------------

interface SensorChartProps {
  deviceId: string;
  sensor: {
    id: string;
    name: string;
    unit: string;
    currentValue: number;
    thresholdWarning?: number;
    thresholdCritical?: number;
  };
  mqttConnected: boolean;
}

function LiveSensorChart({ deviceId, sensor, mqttConnected }: SensorChartProps) {
  // Live MQTT readings
  const { readings: liveReadings, latestValues, isLive } = useLiveTelemetry(deviceId);

  // API polling fallback
  const { data: telemetry = [] } = useDeviceTelemetry(deviceId, 30);

  const useLiveData = mqttConnected && isLive;

  const readings: SensorReading[] = useLiveData
    ? (liveReadings.get(sensor.id) ?? [])
    : telemetry
        .filter((t) => t.sensorId === sensor.id)
        .map((t) => ({ sensorId: t.sensorId, deviceId, value: t.value, timestamp: t.timestamp }));

  const currentValue = useLiveData
    ? (latestValues.get(sensor.id) ?? sensor.currentValue)
    : sensor.currentValue;

  return (
    <div
      className="rounded-md p-3"
      style={{ background: "#0b1520", border: "1px solid #192e48" }}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium" style={{ color: "#e0ecf7" }}>
          {sensor.name}
        </span>
        <span className="text-xs sf-mono" style={{ color: "#00c8ff" }}>
          {currentValue.toFixed(1)} {sensor.unit}
        </span>
      </div>
      <RealtimeLineChart
        readings={readings}
        unit={sensor.unit}
        height={140}
        compact
        color="#00c8ff"
        thresholdWarning={sensor.thresholdWarning}
        thresholdCritical={sensor.thresholdCritical}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Enhanced real-time sensor overview that uses live MQTT data when available,
 * and falls back to API polling when MQTT is not connected.
 */
export function LiveTelemetryOverview() {
  const { data: devices = [] } = useDevices();
  const { connected } = useMqttStatus();

  const featuredSensors = devices
    .filter((d) => d.status !== "offline" && d.sensors.length > 0)
    .slice(0, 3)
    .map((d) => ({ device: d, sensor: d.sensors[0] }));

  return (
    <div className="rounded-lg p-4 sf-card col-span-full">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-4 w-1 rounded-full"
          style={{ background: "linear-gradient(180deg, #00c8ff, #a855f7)" }}
        />
        <h3 className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>
          Real-time Sensor Overview
        </h3>
        <Activity
          className="h-3.5 w-3.5 ml-1 sf-pulse-dot"
          style={{ color: "#00c8ff" }}
        />

        {/* LIVE / POLLING badge */}
        <div className="ml-auto flex items-center gap-1.5">
          {connected ? (
            <div
              className="flex items-center gap-1 rounded px-1.5 py-0.5"
              style={{
                background: "rgba(0,255,157,0.1)",
                border: "1px solid rgba(0,255,157,0.3)",
              }}
            >
              <Wifi className="h-3 w-3" style={{ color: "#00ff9d" }} />
              <span
                className="text-[9px] font-bold sf-mono"
                style={{ color: "#00ff9d" }}
              >
                LIVE
              </span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 rounded px-1.5 py-0.5"
              style={{
                background: "rgba(100,160,220,0.1)",
                border: "1px solid rgba(100,160,220,0.3)",
              }}
            >
              <WifiOff className="h-3 w-3" style={{ color: "#7fa3c2" }} />
              <span
                className="text-[9px] font-bold sf-mono"
                style={{ color: "#7fa3c2" }}
              >
                POLLING
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featuredSensors.map(({ device, sensor }) => (
          <LiveSensorChart
            key={sensor.id}
            deviceId={device.id}
            sensor={sensor}
            mqttConnected={connected}
          />
        ))}
      </div>
    </div>
  );
}
