"use client";

import { useKPIs } from "@/lib/hooks/use-analytics";
import { useDevices } from "@/lib/hooks/use-devices";
import { AlertTriangle, Cpu, Thermometer, Wifi } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  glowColor,
}: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg p-4 sf-card"
      style={{ borderColor: `${accentColor}15` }}
    >
      {/* Subtle corner accent */}
      <div
        className="absolute top-0 right-0 h-16 w-16 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor}, transparent 70%)`,
        }}
      />
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "#7fa3c2" }}
        >
          {title}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{
            background: `${accentColor}15`,
            color: accentColor,
            boxShadow: `0 0 12px ${glowColor}`,
          }}
        >
          {icon}
        </div>
      </div>
      <div
        className="text-3xl font-bold sf-mono"
        style={{ color: accentColor, textShadow: `0 0 20px ${glowColor}` }}
      >
        {value}
      </div>
      <p className="mt-1 text-xs" style={{ color: "#4a6d8a" }}>
        {subtitle}
      </p>
    </div>
  );
}

export function StatsCards() {
  const { data: kpis } = useKPIs();
  const { data: devices = [] } = useDevices();

  const total = kpis?.totalDevices ?? devices.length;
  const online = kpis?.onlineDevices ?? devices.filter((d) => d.status === "online").length;
  const offline = total - online;
  const unackAlerts = kpis?.activeAlerts ?? 0;

  const tempSensors = devices.flatMap((d) =>
    d.sensors.filter((s) => s.type === "temperature"),
  );
  const avgTemp =
    tempSensors.length > 0
      ? tempSensors.reduce((sum, s) => sum + s.currentValue, 0) /
        tempSensors.length
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Devices"
        value={total}
        subtitle={`${online} online, ${offline} offline`}
        icon={<Cpu className="h-4 w-4" />}
        accentColor="#00c8ff"
        glowColor="rgba(0,200,255,0.15)"
      />
      <StatCard
        title="Online Devices"
        value={online}
        subtitle={`${((online / total) * 100).toFixed(0)}% uptime`}
        icon={<Wifi className="h-4 w-4" />}
        accentColor="#00ff9d"
        glowColor="rgba(0,255,157,0.15)"
      />
      <StatCard
        title="Active Alerts"
        value={unackAlerts}
        subtitle={`${kpis?.activeAlerts ?? 0} active alerts`}
        icon={<AlertTriangle className="h-4 w-4" />}
        accentColor="#ffb800"
        glowColor="rgba(255,184,0,0.15)"
      />
      <StatCard
        title="Avg Temperature"
        value={`${avgTemp.toFixed(1)}°C`}
        subtitle={`From ${tempSensors.length} sensors`}
        icon={<Thermometer className="h-4 w-4" />}
        accentColor="#ff4560"
        glowColor="rgba(255,69,96,0.15)"
      />
    </div>
  );
}
