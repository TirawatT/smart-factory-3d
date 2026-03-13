import { NextResponse } from "next/server";
import { subDays, format } from "date-fns";

export async function GET() {
  const data = Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), 6 - i), "EEE"),
    peak: Math.round(1800 + Math.random() * 400),
    offPeak: Math.round(900 + Math.random() * 200),
    cost: parseFloat((3200 + Math.random() * 800).toFixed(0)),
  }));
  return NextResponse.json(data);
}
