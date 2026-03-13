"use client";

import { Header } from "@/components/layout/header";
import { useEnergy, useTopConsumers } from "@/lib/hooks/use-analytics";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Lightbulb, TrendingDown, Zap } from "lucide-react";

const tariffData = [
  { name: "Peak",     value: 58, color: "#ff4560" },
  { name: "Off-Peak", value: 30, color: "#00c8ff" },
  { name: "Shoulder", value: 12, color: "#ffb800" },
];

const recommendations = [
  { icon: <AlertTriangle className="h-4 w-4" style={{ color: "#ffb800" }} />, text: "3 machines left idle during lunch break — potential saving: ฿1,200/day", saving: "฿1,200" },
  { icon: <Lightbulb className="h-4 w-4" style={{ color: "#00c8ff" }} />,     text: "Shift CNC batch jobs to off-peak hours (22:00–06:00) to reduce peak charges", saving: "฿3,400" },
  { icon: <TrendingDown className="h-4 w-4" style={{ color: "#00ff9d" }} />,   text: "HVAC Zone A running at 100% capacity — schedule maintenance for efficiency", saving: "฿800" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#0f1d2e", border: "1px solid #192e48" }}>
      <p className="font-medium mb-1" style={{ color: "#e0ecf7" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} kW</p>
      ))}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EnergyPage() {
  const { data: energyData = [] } = useEnergy();
  const { data: topConsumersData = [] } = useTopConsumers();

  const trendData = energyData.map((d) => ({ day: d.date, peak: d.peak / 10, offPeak: d.offPeak / 10 }));
  const topConsumers = topConsumersData.map((d) => ({ name: d.device.split(" ").slice(0,3).join(" "), kWh: d.kwh }));

  const totalKwh = energyData.reduce((s, d) => s + d.peak + d.offPeak, 0) || trendData.reduce((s, d) => s + d.peak + d.offPeak, 0);
  const totalCost = Math.round(totalKwh * 4.2);
  const carbon    = (totalKwh * 0.5213 / 1000).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="ENERGY MANAGEMENT" subtitle="Consumption · Cost · Carbon footprint" />

      <div className="p-4 md:p-6 space-y-5">

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Consumption", value: `${totalKwh.toLocaleString()}`, unit: "kWh", icon: <Zap className="h-5 w-5" />, color: "#ffb800" },
            { label: "Total Cost",        value: `฿${totalCost.toLocaleString()}`, unit: "this week", icon: <TrendingDown className="h-5 w-5" />, color: "#00c8ff" },
            { label: "Avg Cost / kWh",    value: "฿4.20", unit: "per unit", icon: <Lightbulb className="h-5 w-5" />, color: "#00ff9d" },
            { label: "Carbon Footprint",  value: carbon, unit: "tCO₂e", icon: <AlertTriangle className="h-5 w-5" />, color: "#ff4560" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>{s.icon}</div>
              <p className="text-2xl font-bold sf-mono" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#4a6d8a" }}>{s.unit}</p>
              <p className="text-xs mt-1" style={{ color: "#7fa3c2" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Consumption trend */}
          <div className="lg:col-span-2 rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "#e0ecf7" }}>Consumption Trend — Last 7 Days</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="peak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4560" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff4560" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="offPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c8ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00c8ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#192e48" />
                <XAxis dataKey="day" tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} unit=" kW" />
                <Tooltip content={<CustomTooltip />} />
                <Area dataKey="peak"    name="Peak"     stroke="#ff4560" fill="url(#peak)"    strokeWidth={2} />
                <Area dataKey="offPeak" name="Off-Peak" stroke="#00c8ff" fill="url(#offPeak)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tariff breakdown */}
          <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "#e0ecf7" }}>Cost by Tariff</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={tariffData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {tariffData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, ""]} contentStyle={{ background: "#0f1d2e", border: "1px solid #192e48", borderRadius: 8 }} labelStyle={{ color: "#e0ecf7" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {tariffData.map((t) => (
                <div key={t.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                  <span style={{ color: "#7fa3c2" }}>{t.name}</span>
                  <span className="ml-auto sf-mono font-bold" style={{ color: t.color }}>{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Top consumers */}
          <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "#e0ecf7" }}>Top Consumers</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topConsumers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#192e48" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} unit=" kWh" />
                <YAxis type="category" dataKey="name" tick={{ fill: "#7fa3c2", fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={{ background: "#0f1d2e", border: "1px solid #192e48", borderRadius: 8 }} labelStyle={{ color: "#e0ecf7" }} />
                <Bar dataKey="kWh" fill="#00c8ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "#e0ecf7" }}>AI Recommendations</p>
            <div className="space-y-3">
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md p-3"
                  style={{ background: "#070d18", border: "1px solid #192e48" }}
                >
                  <div className="mt-0.5 shrink-0">{r.icon}</div>
                  <p className="flex-1 text-xs leading-relaxed" style={{ color: "#7fa3c2" }}>{r.text}</p>
                  <span className="shrink-0 text-xs font-bold sf-mono" style={{ color: "#00ff9d" }}>
                    {r.saving}/day
                  </span>
                </div>
              ))}
              <div className="rounded-md px-3 py-2 text-xs sf-mono text-center"
                style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)", color: "#00ff9d" }}
              >
                Total potential saving: ฿5,400/day
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
