import { NextRequest, NextResponse } from "next/server";
import { mockDevices } from "@/lib/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "24");

  const device = mockDevices.find((d) => d.id === id);
  if (!device) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = Date.now();
  const readings = device.sensors.flatMap((sensor) =>
    Array.from({ length: limit }, (_, i) => ({
      sensorId: sensor.id,
      value: sensor.currentValue + (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.1,
      timestamp: now - (limit - i) * 60000,
    }))
  );

  return NextResponse.json(readings);
}
