import { NextResponse } from "next/server";
import { subDays, format } from "date-fns";

export async function GET() {
  const data = Array.from({ length: 42 }, (_, i) => {
    const date = format(subDays(new Date(), 41 - i), "MMM dd");
    const oee = 78 + Math.sin(i * 0.3) * 10 + Math.random() * 5;
    return {
      date,
      oee: parseFloat(oee.toFixed(1)),
      availability: parseFloat((oee + 5 + Math.random() * 3).toFixed(1)),
      performance: parseFloat((oee - 3 + Math.random() * 4).toFixed(1)),
      quality: parseFloat((oee + 8 + Math.random() * 2).toFixed(1)),
    };
  });
  return NextResponse.json(data);
}
