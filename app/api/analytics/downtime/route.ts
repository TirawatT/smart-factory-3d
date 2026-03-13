import { NextResponse } from "next/server";

const data = [
  { cause: "Mechanical Failure", minutes: 142, pct: 38 },
  { cause: "Scheduled Maintenance", minutes: 95,  pct: 25 },
  { cause: "Material Shortage",    minutes: 68,  pct: 18 },
  { cause: "Quality Hold",         minutes: 45,  pct: 12 },
  { cause: "Power Interruption",   minutes: 26,  pct: 7  },
];

export async function GET() {
  return NextResponse.json(data);
}
