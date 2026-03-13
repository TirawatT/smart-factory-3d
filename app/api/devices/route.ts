import { NextRequest, NextResponse } from "next/server";
import { mockDevices } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const zone = searchParams.get("zone");
  const search = searchParams.get("search");

  let devices = [...mockDevices];
  if (status && status !== "all") devices = devices.filter((d) => d.status === status);
  if (zone) devices = devices.filter((d) => d.zone === zone);
  if (search) {
    const q = search.toLowerCase();
    devices = devices.filter((d) => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
  }

  return NextResponse.json(devices);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newDevice = {
    id: `dev-${Date.now()}`,
    ...body,
    status: "online",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(newDevice, { status: 201 });
}
