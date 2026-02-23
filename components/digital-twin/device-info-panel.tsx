"use client";

import { GaugeChart } from "@/components/charts/gauge-chart";
import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceStatus } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import {
  Check,
  Clipboard,
  Code2,
  Cpu,
  ExternalLink,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

export function DeviceInfoPanel() {
  const devices = useDeviceStore((s) => s.devices);
  const selectedDeviceId = useRealtimeStore((s) => s.selectedDeviceId);
  const setSelectedDeviceId = useRealtimeStore((s) => s.setSelectedDeviceId);
  const getReadings = useRealtimeStore((s) => s.getReadings);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const device = devices.find((d) => d.id === selectedDeviceId);

  function copyDeviceUrl() {
    if (!device) return;
    const url = `${window.location.origin}/digital-twin?device=${device.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  }

  function copySnippet() {
    if (!device) return;
    const snippet =
      `<!-- Device Pin: ${device.name} -->\n` +
      `<a href="#" onclick="window.parent.postMessage({deviceId:'${device.id}'},'*');return false;" ` +
      `title="${device.name}" style="color:#00c8ff;font-family:sans-serif;font-size:12px;">` +
      `📍 ${device.name}</a>`;
    navigator.clipboard.writeText(snippet).then(() => {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    });
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: "linear-gradient(180deg, #0b1520, #0f1d2e)",
        borderLeft: "1px solid #192e48",
      }}
    >
      {/* Device Selector */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid #192e48" }}>
        <Select
          value={selectedDeviceId ?? ""}
          onValueChange={(v) => setSelectedDeviceId(v || null)}
        >
          <SelectTrigger className="h-9 text-xs border-[#192e48] bg-[#0b1520] text-[#e0ecf7]">
            <SelectValue placeholder="Select a device..." />
          </SelectTrigger>
          <SelectContent className="border-[#192e48] bg-[#0f1d2e]">
            {devices.map((d) => (
              <SelectItem
                key={d.id}
                value={d.id}
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      background: statusConfig[d.status].color,
                      boxShadow: `0 0 4px ${statusConfig[d.status].color}60`,
                    }}
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
          <div className="space-y-4 p-4 sf-fade-in">
            {/* Device Info Header */}
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" style={{ color: "#00c8ff" }} />
                <h3 className="font-semibold" style={{ color: "#e0ecf7" }}>
                  {device.name}
                </h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-0 text-xs"
                  style={{
                    background: statusConfig[device.status].bg,
                    color: statusConfig[device.status].color,
                  }}
                >
                  {device.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-[#192e48] text-xs"
                  style={{ color: "#7fa3c2" }}
                >
                  {device.type}
                </Badge>
              </div>
              <div
                className="mt-2 flex items-center gap-1 text-xs"
                style={{ color: "#4a6d8a" }}
              >
                <MapPin className="h-3 w-3" />
                {device.location}
              </div>
              <p className="mt-1 text-xs" style={{ color: "#4a6d8a" }}>
                {device.zone}
              </p>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #192e48" }} />

            {/* Sensor Gauges */}
            <div>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider sf-section-bar"
                style={{ color: "#7fa3c2" }}
              >
                Live Sensors
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {device.sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="rounded-md p-2"
                    style={{
                      background: "#0b1520",
                      border: "1px solid #192e48",
                    }}
                  >
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
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #192e48" }} />

            {/* Mini Charts */}
            <div>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider sf-section-bar"
                style={{ color: "#7fa3c2" }}
              >
                Recent Trend
              </h4>
              {device.sensors.map((sensor) => {
                const readings = getReadings(sensor.id);
                return (
                  <div key={sensor.id} className="mb-3">
                    <div className="mb-1 flex items-baseline justify-between">
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "#e0ecf7" }}
                      >
                        {sensor.name}
                      </span>
                      <span
                        className="text-[11px] sf-mono"
                        style={{ color: "#00c8ff" }}
                      >
                        {sensor.currentValue.toFixed(1)} {sensor.unit}
                      </span>
                    </div>
                    <RealtimeLineChart
                      readings={readings.slice(-30)}
                      unit={sensor.unit}
                      height={80}
                      compact
                      showGrid={false}
                      color="#00c8ff"
                    />
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #192e48" }} />

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                asChild
                size="sm"
                className="flex-1 bg-[#00c8ff] text-[#070d18] hover:bg-[#00b0e0] font-semibold"
              >
                <Link href={`/devices/${device.id}`}>
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View Details
                </Link>
              </Button>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #192e48" }} />

            {/* Link Generator */}
            <div>
              <h4
                className="mb-3 text-xs font-semibold uppercase tracking-wider sf-section-bar"
                style={{ color: "#7fa3c2" }}
              >
                Generate Link
              </h4>

              {/* Device URL */}
              <div
                className="mb-2 rounded-md px-3 py-2"
                style={{ background: "#0b1520", border: "1px solid #192e48" }}
              >
                <p
                  className="mb-1 text-[10px] uppercase tracking-wider"
                  style={{ color: "#4a6d8a" }}
                >
                  Deep-link URL
                </p>
                <p
                  className="mb-2 break-all text-[11px] sf-mono"
                  style={{ color: "#00c8ff" }}
                >
                  /digital-twin?device={device.id}
                </p>
                <Button
                  size="sm"
                  className="h-7 w-full text-xs border-[#1e3c60] bg-[#0f1d2e] text-[#e0ecf7] hover:bg-[#142338] hover:text-[#00c8ff]"
                  variant="outline"
                  onClick={copyDeviceUrl}
                >
                  {copiedUrl ? (
                    <>
                      <Check className="mr-1 h-3 w-3 text-[#00ff9d]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="mr-1 h-3 w-3" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>

              {/* 3D HTML Snippet */}
              <div
                className="rounded-md px-3 py-2"
                style={{ background: "#0b1520", border: "1px solid #192e48" }}
              >
                <p
                  className="mb-1 text-[10px] uppercase tracking-wider"
                  style={{ color: "#4a6d8a" }}
                >
                  3D Viewer snippet
                </p>
                <p
                  className="mb-2 break-all text-[11px] sf-mono leading-relaxed"
                  style={{ color: "#7fa3c2" }}
                >
                  {`<a onclick="postMessage({deviceId:'${device.id}'},'*')">📍 ${device.name}</a>`}
                </p>
                <Button
                  size="sm"
                  className="h-7 w-full text-xs border-[#1e3c60] bg-[#0f1d2e] text-[#e0ecf7] hover:bg-[#142338] hover:text-[#00c8ff]"
                  variant="outline"
                  onClick={copySnippet}
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="mr-1 h-3 w-3 text-[#00ff9d]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Code2 className="mr-1 h-3 w-3" />
                      Copy 3D Snippet
                    </>
                  )}
                </Button>
              </div>

              {device.matterportTagId && (
                <p className="mt-2 text-[10px]" style={{ color: "#4a6d8a" }}>
                  Matterport Tag ID:{" "}
                  <span className="sf-mono" style={{ color: "#7fa3c2" }}>
                    {device.matterportTagId}
                  </span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center">
            <Cpu className="h-10 w-10" style={{ color: "#192e48" }} />
            <p className="text-sm" style={{ color: "#4a6d8a" }}>
              Select a device from the dropdown or click a pin in the 3D model
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
