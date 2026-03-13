import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  if (!refreshToken) return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });

  const token = `mock-jwt-refreshed-${Date.now()}`;
  const newRefresh = `mock-refresh-${Date.now()}`;
  return NextResponse.json({ token, refreshToken: newRefresh });
}
