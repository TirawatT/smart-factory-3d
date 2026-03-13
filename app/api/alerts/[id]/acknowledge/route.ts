import { NextRequest, NextResponse } from "next/server";
import { mockAlerts } from "@/lib/mock-data";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const alert = mockAlerts.find((a) => a.id === id);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...alert, acknowledged: true });
}
