import { NextRequest, NextResponse } from "next/server";
import { mockAlerts } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";
  const severity = searchParams.get("severity");

  let alerts = [...mockAlerts];
  if (status === "active") alerts = alerts.filter((a) => !a.acknowledged);
  else if (status === "acknowledged") alerts = alerts.filter((a) => a.acknowledged);
  if (severity) alerts = alerts.filter((a) => a.severity === severity);

  return NextResponse.json(alerts);
}
