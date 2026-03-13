import { NextResponse } from "next/server";
import { mockDevices, mockAlerts } from "@/lib/mock-data";

export async function GET() {
  const totalDevices = mockDevices.length;
  const onlineDevices = mockDevices.filter((d) => d.status === "online").length;
  const activeAlerts = mockAlerts.filter((a) => !a.acknowledged).length;
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;

  return NextResponse.json({
    totalDevices,
    onlineDevices,
    activeAlerts,
    criticalAlerts,
    oee: 87.4,
    production: 1284,
    energyToday: 3241,
    uptimePct: 97.8,
  });
}
