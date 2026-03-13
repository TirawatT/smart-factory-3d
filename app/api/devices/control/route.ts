import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { deviceId, command, params } = await req.json();
  if (!deviceId || !command) {
    return NextResponse.json({ error: "Missing deviceId or command" }, { status: 400 });
  }
  return NextResponse.json({
    success: true,
    deviceId,
    command,
    params,
    timestamp: new Date().toISOString(),
    message: `Command '${command}' executed on device ${deviceId}`,
  });
}
