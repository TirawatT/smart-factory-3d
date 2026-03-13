import { NextResponse } from "next/server";

const data = [
  { device: "CNC Machine CNC-001", kwh: 842, cost: 2947 },
  { device: "Industrial Robot R-001", kwh: 631, cost: 2208 },
  { device: "Conveyor Belt CB-A1", kwh: 512, cost: 1792 },
  { device: "Compressor AC-001", kwh: 489, cost: 1712 },
  { device: "Pump PUMP-003", kwh: 367, cost: 1285 },
];

export async function GET() {
  return NextResponse.json(data);
}
