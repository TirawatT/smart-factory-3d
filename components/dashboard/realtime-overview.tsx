"use client";

import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";

export function RealtimeOverview() {
  const devices = useDeviceStore((s) => s.devices);
  const getReadings = useRealtimeStore((s) => s.getReadings);

  // Pick the first sensor of each of the first 3 online devices
  const featuredSensors = devices
    .filter((d) => d.status !== "offline")
    .slice(0, 3)
    .map((d) => ({
      device: d,
      sensor: d.sensors[0],
    }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Real-time Sensor Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredSensors.map(({ device, sensor }) => {
            const readings = getReadings(sensor.id);
            return (
              <div key={sensor.id}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs font-medium">{device.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {sensor.currentValue.toFixed(1)} {sensor.unit}
                  </span>
                </div>
                <RealtimeLineChart
                  readings={readings}
                  unit={sensor.unit}
                  height={140}
                  compact
                  thresholdWarning={sensor.thresholdWarning}
                  thresholdCritical={sensor.thresholdCritical}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
