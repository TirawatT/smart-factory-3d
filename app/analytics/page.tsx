"use client";

import { Header } from "@/components/layout/header";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { Download, BarChart3, TrendingUp, Clock, Wrench } from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────────

const oeeTrend = [
  { week: "W1", oee: 78, availability: 88, performance: 90, quality: 99 },
  { week: "W2", oee: 82, availability: 91, performance: 92, quality: 98 },
  { week: "W3", oee: 80, availability: 89, performance: 91, quality: 98 },
  { week: "W4", oee: 85, availability: 93, performance: 93, quality: 98 },
  { week: "W5", oee: 87, availability: 94, performance: 94, quality: 98 },
  { week: "W6", oee: 83, availability: 92, performance: 91, quality: 99 },
];

const productionComparison = [
  { line: "Line A", target: 1200, actual: 1143, unit: "units" },
  { line: "Line B", target: 900,  actual: 878,  unit: "units" },
  { line: "Line C", target: 600,  actual: 621,  unit: "units" },
  { line: "Line D", target: 450,  actual: 389,  unit: "units" },
];

const downtimeData = [
  { cause: "Mechanical",  minutes: 142, color: "#ff4560" },
  { cause: "Electrical",  minutes: 98,  color: "#ffb800" },
  { cause: "Setup/Changeover", minutes: 210, color: "#00c8ff" },
  { cause: "Material",    minutes: 65,  color: "#8b5cf6" },
  { cause: "Operator",    minutes: 43,  color: "#00ff9d" },
];

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: "#0f1d2e", border: "1px solid #192e48", borderRadius: 8 },
  labelStyle: { color: "#e0ecf7" },
};

// ── Report card ────────────────────────────────────────────────────────────────

function ReportCard({ icon, title, value, unit, trend, trendUp }: {
  icon: React.ReactNode; title: string; value: string; unit: string;
  trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
      <div className="flex items-center gap-2 mb-3" style={{ color: "#4a6d8a" }}>{icon}</div>
      <p className="text-2xl font-bold sf-mono" style={{ color: "#e0ecf7" }}>{value}</p>
      <p className="text-[10px]" style={{ color: "#4a6d8a" }}>{unit}</p>
      <p className="text-xs mt-2" style={{ color: "#7fa3c2" }}>{title}</p>
      <p className="text-[10px] mt-1 sf-mono" style={{ color: trendUp ? "#00ff9d" : "#ff4560" }}>
        {trendUp ? "▲" : "▼"} {trend}
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const totalDowntime = downtimeData.reduce((s, d) => s + d.minutes, 0);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="ANALYTICS" subtitle="OEE · Production · Downtime Analysis" />

      <div className="p-4 md:p-6 space-y-5">

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ReportCard icon={<BarChart3 className="h-5 w-5" />} title="Avg OEE" value="82.5%" unit="last 6 weeks" trend="+4.5% vs last month" trendUp />
          <ReportCard icon={<TrendingUp className="h-5 w-5" />} title="Production" value="3,031" unit="units this week" trend="+2.1% vs target" trendUp />
          <ReportCard icon={<Clock className="h-5 w-5" />} title="Total Downtime" value={`${totalDowntime}m`} unit="this week" trend="+12% vs last week" trendUp={false} />
          <ReportCard icon={<Wrench className="h-5 w-5" />} title="MTBF" value="72h" unit="mean time between failures" trend="+8h vs last month" trendUp />
        </div>

        {/* OEE trend + production comparison */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* OEE trend */}
          <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>OEE Trend — 6 Weeks</p>
              <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-all hover:bg-[#142338]"
                style={{ border: "1px solid #192e48", color: "#7fa3c2" }}>
                <Download className="h-3 w-3" /> Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={oeeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#192e48" />
                <XAxis dataKey="week" tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v: any, n: any) => [`${v}%`, n]} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#7fa3c2" }} />
                <Line dataKey="oee"         name="OEE"          stroke="#00c8ff" strokeWidth={2} dot={false} />
                <Line dataKey="availability"name="Availability"  stroke="#00ff9d" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                <Line dataKey="performance" name="Performance"   stroke="#ffb800" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Production target vs actual */}
          <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>Production — Target vs Actual</p>
              <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-all hover:bg-[#142338]"
                style={{ border: "1px solid #192e48", color: "#7fa3c2" }}>
                <Download className="h-3 w-3" /> Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productionComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#192e48" />
                <XAxis dataKey="line" tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} unit=" u" />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#7fa3c2" }} />
                <Bar dataKey="target" name="Target" fill="#192e48" radius={[4,4,0,0]} />
                <Bar dataKey="actual" name="Actual" fill="#00c8ff" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Downtime analysis */}
        <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>Downtime Analysis by Cause</p>
            <span className="text-xs sf-mono" style={{ color: "#4a6d8a" }}>Total: {totalDowntime} min this week</span>
          </div>
          <div className="space-y-3">
            {downtimeData.sort((a,b) => b.minutes - a.minutes).map((d) => {
              const pct = Math.round((d.minutes / totalDowntime) * 100);
              return (
                <div key={d.cause} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#7fa3c2" }}>{d.cause}</span>
                    <span className="sf-mono" style={{ color: d.color }}>{d.minutes} min ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#192e48" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: d.color, boxShadow: `0 0 8px ${d.color}60` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
