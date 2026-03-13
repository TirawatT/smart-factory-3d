import { NextRequest, NextResponse } from "next/server";
import { mockDevices } from "@/lib/mock-data";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const device = mockDevices.find((d) => d.id === id);
  if (!device) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(device);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const device = mockDevices.find((d) => d.id === id);
  if (!device) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...device, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exists = mockDevices.some((d) => d.id === id);
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
