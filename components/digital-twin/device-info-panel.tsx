"use client";

import { GaugeChart } from "@/components/charts/gauge-chart";
import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DeviceStatus } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import { Cpu, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";

const statusVariant: Record<DeviceStatus, string> = {
  online: "bg-green-500/10 text-green-500 border-green-500/20",
  offline: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function DeviceInfoPanel() {
  const devices = useDeviceStore((s) => s.devices);
  const selectedDeviceId = useRealtimeStore((s) => s.selectedDeviceId);
  const setSelectedDeviceId = useRealtimeStore((s) => s.setSelectedDeviceId);
  const getReadings = useRealtimeStore((s) => s.getReadings);

  const device = devices.find((d) => d.id === selectedDeviceId);

  return (
    <div className="flex h-full flex-col border-l bg-card">
      {/* Device Selector */}
      <div className="border-b px-4 py-3">
        <Select
          value={selectedDeviceId ?? ""}
          onValueChange={(v) => setSelectedDeviceId(v || null)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Select a device..." />
          </SelectTrigger>
          <SelectContent>
            {devices.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      d.status === "online"
                        ? "bg-green-500"
                        : d.status === "warning"
                          ? "bg-amber-500"
                          : d.status === "critical"
                            ? "bg-red-500"
                            : "bg-gray-400"
                    }`}
                  />
                  {d.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        {device ? (
          <div className="space-y-4 p-4">
            {/* Device Info Header */}
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">{device.name}</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={statusVariant[device.status]}
                >
                  {device.status}
                </Badge>
                <Badge variant="outline">{device.type}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {device.location}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {device.zone}
              </p>
            </div>

            <Separator />

            {/* Sensor Gauges */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live Sensors
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {device.sensors.map((sensor) => (
                  <Card key={sensor.id} className="p-2">
                    <GaugeChart
                      value={sensor.currentValue}
                      min={sensor.min}
                      max={sensor.max}
                      thresholdWarning={sensor.thresholdWarning}
                      thresholdCritical={sensor.thresholdCritical}
                      unit={sensor.unit}
                      label={sensor.name}
                      size={100}
                    />
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Mini Charts */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Trend
              </h4>
              {device.sensors.map((sensor) => {
                const readings = getReadings(sensor.id);
                return (
                  <div key={sensor.id} className="mb-3">
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-[11px] font-medium">
                        {sensor.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {sensor.currentValue.toFixed(1)} {sensor.unit}
                      </span>
                    </div>
                    <RealtimeLineChart
                      readings={readings.slice(-30)}
                      unit={sensor.unit}
                      height={80}
                      compact
                      showGrid={false}
                    />
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/devices/${device.id}`}>
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center">
            <Cpu className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Select a device from the dropdown or click a pin in the 3D model
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
