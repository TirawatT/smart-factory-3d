import { NextResponse } from "next/server";
import { subDays, format } from "date-fns";

export async function GET() {
  const data = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), "MMM dd"),
    target: 1200,
    actual: Math.round(1100 + Math.random() * 200),
  }));
  return NextResponse.json(data);
}
