"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import { AlertTriangle, Cpu, Thermometer, Wifi } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={color}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const devices = useDeviceStore((s) => s.devices);
  const alerts = useRealtimeStore((s) => s.alerts);

  const total = devices.length;
  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;
  const unackAlerts = alerts.filter((a) => !a.acknowledged).length;

  // avg temperature from all temperature sensors
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
        icon={<Cpu className="h-5 w-5" />}
        color="text-blue-500"
      />
      <StatCard
        title="Online Devices"
        value={online}
        subtitle={`${((online / total) * 100).toFixed(0)}% uptime`}
        icon={<Wifi className="h-5 w-5" />}
        color="text-green-500"
      />
      <StatCard
        title="Active Alerts"
        value={unackAlerts}
        subtitle={`${alerts.length} total alerts`}
        icon={<AlertTriangle className="h-5 w-5" />}
        color="text-amber-500"
      />
      <StatCard
        title="Avg Temperature"
        value={`${avgTemp.toFixed(1)}°C`}
        subtitle={`From ${tempSensors.length} sensors`}
        icon={<Thermometer className="h-5 w-5" />}
        color="text-red-500"
      />
    </div>
  );
}
