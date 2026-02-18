"use client";

import { GaugeChart } from "@/components/charts/gauge-chart";
import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceStatus } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  MapPin,
  Tag,
  Wifi,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

const statusConfig: Record<
  DeviceStatus,
  { color: string; bg: string; border: string }
> = {
  online: {
    color: "#00ff9d",
    bg: "rgba(0,255,157,0.08)",
    border: "rgba(0,255,157,0.2)",
  },
  offline: {
    color: "#4a6d8a",
    bg: "rgba(74,109,138,0.08)",
    border: "rgba(74,109,138,0.2)",
  },
  warning: {
    color: "#ffb800",
    bg: "rgba(255,184,0,0.08)",
    border: "rgba(255,184,0,0.2)",
  },
  critical: {
    color: "#ff4560",
    bg: "rgba(255,69,96,0.08)",
    border: "rgba(255,69,96,0.2)",
  },
};

export default function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const devices = useDeviceStore((s) => s.devices);
  const getReadings = useRealtimeStore((s) => s.getReadings);
  const alerts = useRealtimeStore((s) => s.alerts);

  const device = devices.find((d) => d.id === id);

  if (!device) {
    return (
      <>
        <Header title="Device Not Found" />
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <p style={{ color: "#7fa3c2" }}>
            Device with ID &ldquo;{id}&rdquo; was not found.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-[#192e48] bg-[#0b1520] text-[#00c8ff] hover:bg-[#142338]"
          >
            <Link href="/devices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const deviceAlerts = alerts.filter((a) => a.deviceId === device.id);
  const cfg = statusConfig[device.status];

  return (
    <>
      <Header
        title={device.name}
        subtitle={`${device.type} — ${device.zone}`}
      />
      <div className="space-y-6 p-6 sf-fade-in">
        {/* Back + Info Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="mt-0.5 hover:bg-[#142338]"
            >
              <Link href="/devices">
                <ArrowLeft className="h-5 w-5" style={{ color: "#7fa3c2" }} />
              </Link>
            </Button>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#e0ecf7" }}>
                {device.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <Badge
                  variant="outline"
                  className="border-0 uppercase sf-mono"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {device.status}
                </Badge>
                <span
                  className="flex items-center gap-1"
                  style={{ color: "#7fa3c2" }}
                >
                  <Tag className="h-3 w-3" />
                  {device.type}
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{ color: "#7fa3c2" }}
                >
                  <MapPin className="h-3 w-3" />
                  {device.location}
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{ color: "#4a6d8a" }}
                >
                  <Clock className="h-3 w-3" />
                  Updated{" "}
                  {format(new Date(device.updatedAt), "dd MMM yyyy HH:mm")}
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2 rounded-md px-3 py-1.5"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            <Wifi
              className="h-4 w-4 sf-pulse-dot"
              style={{ color: cfg.color }}
            />
            <span
              className="text-xs font-medium sf-mono"
              style={{ color: cfg.color }}
            >
              {device.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sensors" className="w-full">
          <TabsList
            className="w-full justify-start rounded-none border-b bg-transparent p-0"
            style={{ borderColor: "#192e48" }}
          >
            {["sensors", "charts", "alerts"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm capitalize transition-all data-[state=active]:border-[#00c8ff] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                style={{ color: "#7fa3c2" }}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Sensors Tab */}
          <TabsContent value="sensors" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {device.sensors.map((sensor) => (
                <div key={sensor.id} className="rounded-lg p-4 sf-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4
                      className="text-sm font-medium"
                      style={{ color: "#e0ecf7" }}
                    >
                      {sensor.name}
                    </h4>
                    <span
                      className="text-[10px] uppercase sf-mono px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(0,200,255,0.1)",
                        color: "#00c8ff",
                      }}
                    >
                      {sensor.type}
                    </span>
                  </div>
                  <GaugeChart
                    value={sensor.currentValue}
                    min={sensor.min}
                    max={sensor.max}
                    thresholdWarning={sensor.thresholdWarning}
                    thresholdCritical={sensor.thresholdCritical}
                    unit={sensor.unit}
                    size={140}
                  />
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p
                        className="text-[10px] uppercase"
                        style={{ color: "#4a6d8a" }}
                      >
                        Min
                      </p>
                      <p
                        className="text-xs font-medium sf-mono"
                        style={{ color: "#7fa3c2" }}
                      >
                        {sensor.min}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase"
                        style={{ color: "#4a6d8a" }}
                      >
                        Current
                      </p>
                      <p
                        className="text-xs font-bold sf-mono"
                        style={{ color: "#00c8ff" }}
                      >
                        {sensor.currentValue.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase"
                        style={{ color: "#4a6d8a" }}
                      >
                        Max
                      </p>
                      <p
                        className="text-xs font-medium sf-mono"
                        style={{ color: "#7fa3c2" }}
                      >
                        {sensor.max}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="mt-6">
            <div className="space-y-6">
              {device.sensors.map((sensor) => {
                const readings = getReadings(sensor.id);
                return (
                  <div key={sensor.id} className="rounded-lg p-4 sf-card">
                    <div className="mb-3 flex items-baseline justify-between">
                      <h4
                        className="text-sm font-medium sf-section-bar"
                        style={{ color: "#e0ecf7" }}
                      >
                        {sensor.name}
                      </h4>
                      <span
                        className="sf-mono text-sm"
                        style={{ color: "#00c8ff" }}
                      >
                        {sensor.currentValue.toFixed(1)} {sensor.unit}
                      </span>
                    </div>
                    <RealtimeLineChart
                      readings={readings}
                      unit={sensor.unit}
                      color="#00c8ff"
                      thresholdWarning={sensor.thresholdWarning}
                      thresholdCritical={sensor.thresholdCritical}
                      height={200}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            {deviceAlerts.length === 0 ? (
              <div className="py-12 text-center" style={{ color: "#4a6d8a" }}>
                <AlertTriangle
                  className="mx-auto mb-3 h-10 w-10"
                  style={{ color: "#192e48" }}
                />
                <p>No alerts for this device</p>
              </div>
            ) : (
              <div className="space-y-2">
                {deviceAlerts.map((alert) => {
                  const alertColor =
                    alert.severity === "critical"
                      ? "#ff4560"
                      : alert.severity === "warning"
                        ? "#ffb800"
                        : "#00c8ff";
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 rounded-md p-3"
                      style={{
                        background: `${alertColor}08`,
                        border: `1px solid ${alertColor}20`,
                      }}
                    >
                      {alert.severity === "critical" ? (
                        <XCircle
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: alertColor }}
                        />
                      ) : (
                        <AlertTriangle
                          className="h-4 w-4 mt-0.5 shrink-0"
                          style={{ color: alertColor }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-0 text-[10px] uppercase sf-mono"
                            style={{
                              background: `${alertColor}15`,
                              color: alertColor,
                            }}
                          >
                            {alert.severity}
                          </Badge>
                          {alert.acknowledged && (
                            <span
                              className="text-[10px]"
                              style={{ color: "#4a6d8a" }}
                            >
                              Acknowledged
                            </span>
                          )}
                        </div>
                        <p
                          className="mt-1 text-sm"
                          style={{ color: "#e0ecf7" }}
                        >
                          {alert.message}
                        </p>
                        <p
                          className="mt-1 text-[10px] sf-mono"
                          style={{ color: "#4a6d8a" }}
                        >
                          {format(
                            new Date(alert.timestamp),
                            "dd MMM yyyy HH:mm:ss",
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
