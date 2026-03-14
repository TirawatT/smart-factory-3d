"use client";

import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { useDevices, useDeviceTelemetry } from "@/lib/hooks/use-devices";
import { SensorReading } from "@/lib/types";
import { Activity } from "lucide-react";

// Sub-component that fetches telemetry for a single device+sensor
function SensorChart({
  deviceId,
  sensor,
}: {
  deviceId: string;
  sensor: { id: string; name: string; unit: string; currentValue: number; thresholdWarning?: number; thresholdCritical?: number };
}) {
  const { data: telemetry = [] } = useDeviceTelemetry(deviceId, 30);

  const readings: SensorReading[] = telemetry
    .filter((t) => t.sensorId === sensor.id)
    .map((t) => ({ sensorId: t.sensorId, deviceId, value: t.value, timestamp: t.timestamp }));

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
          {sensor.currentValue.toFixed(1)} {sensor.unit}
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

export function RealtimeOverview() {
  const { data: devices = [] } = useDevices();

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
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {featuredSensors.map(({ device, sensor }) => (
          <SensorChart key={sensor.id} deviceId={device.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
}
