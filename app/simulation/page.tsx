"use client";

import { Header } from "@/components/layout/header";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Cpu, Play, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";

// ── Preset scenarios ──────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: "throughput",
    label: "Max Throughput",
    description: "Maximize production output while maintaining quality thresholds",
    icon: "⚡",
  },
  {
    id: "energy",
    label: "Energy Saving",
    description: "Reduce energy consumption by shifting load to off-peak hours",
    icon: "🌱",
  },
  {
    id: "maintenance",
    label: "Predictive Maintenance",
    description: "Simulate failure probability based on current sensor degradation",
    icon: "🔧",
  },
  {
    id: "bottleneck",
    label: "Bottleneck Analysis",
    description: "Identify production bottlenecks under peak demand scenario",
    icon: "🔍",
  },
];

function generateResult(scenarioId: string) {
  const base = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, value: 0 }));
  if (scenarioId === "throughput") return base.map((d, i) => ({ ...d, value: 80 + Math.sin(i * 0.5) * 15 + Math.random() * 5 }));
  if (scenarioId === "energy")     return base.map((d, i) => ({ ...d, value: 120 - (i > 8 && i < 18 ? 0 : 30) + Math.random() * 10 }));
  if (scenarioId === "maintenance") return base.map((d, i) => ({ ...d, value: Math.min(100, 5 + i * 4 + Math.random() * 8) }));
  return base.map((d, i) => ({ ...d, value: 60 + Math.abs(Math.sin(i * 0.8)) * 30 + Math.random() * 5 }));
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SimulationPage() {
  const [selected, setSelected] = useState(SCENARIOS[0].id);
  const [params, setParams] = useState({ machines: 8, speed: 80, shiftHours: 16, workers: 12 });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<null | { data: any[]; summary: Record<string, string> }>(null);

  const runSimulation = async () => {
    setRunning(true);
    setResults(null);
    await new Promise((r) => setTimeout(r, 1800));
    const data = generateResult(selected);
    const avg = (data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(1);
    setResults({
      data,
      summary: {
        "Avg OEE": `${avg}%`,
        "Peak Output": `${(parseFloat(avg) * 1.2).toFixed(0)} units/h`,
        "Energy Usage": `${(parseFloat(avg) * 2.1).toFixed(0)} kWh`,
        "Est. Cost Saving": `฿${(Math.random() * 5000 + 1000).toFixed(0)}/day`,
      },
    });
    setRunning(false);
  };

  const scenario = SCENARIOS.find((s) => s.id === selected)!;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="SIMULATION" subtitle="What-if analysis · Scenario planning" />

      <div className="p-4 md:p-6 space-y-5">
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Config panel */}
          <div className="space-y-4">
            {/* Scenario selection */}
            <div className="rounded-lg p-4 space-y-2" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#4a6d8a" }}>Scenario</p>
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className="w-full text-left rounded-md p-3 transition-all duration-150"
                  style={{
                    background: selected === s.id ? "rgba(0,200,255,0.08)" : "#070d18",
                    border: selected === s.id ? "1px solid rgba(0,200,255,0.3)" : "1px solid #192e48",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm font-medium" style={{ color: selected === s.id ? "#00c8ff" : "#e0ecf7" }}>{s.label}</span>
                  </div>
                  <p className="text-[10px] mt-1 ml-7" style={{ color: "#4a6d8a" }}>{s.description}</p>
                </button>
              ))}
            </div>

            {/* Parameters */}
            <div className="rounded-lg p-4 space-y-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#4a6d8a" }}>Parameters</p>
              {[
                { key: "machines", label: "Active Machines", min: 1, max: 20, unit: "" },
                { key: "speed", label: "Line Speed", min: 20, max: 100, unit: "%" },
                { key: "shiftHours", label: "Shift Hours", min: 8, max: 24, unit: "h" },
                { key: "workers", label: "Operators", min: 4, max: 30, unit: "" },
              ].map(({ key, label, min, max, unit }) => {
                const val = params[key as keyof typeof params];
                const pct = ((val - min) / (max - min)) * 100;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#7fa3c2" }}>{label}</span>
                      <span className="sf-mono" style={{ color: "#00c8ff" }}>{val}{unit}</span>
                    </div>
                    <input type="range" min={min} max={max} value={val}
                      onChange={(e) => setParams((p) => ({ ...p, [key]: +e.target.value }))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #00c8ff ${pct}%, #192e48 ${pct}%)` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Run button */}
            <button
              onClick={runSimulation}
              disabled={running}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all duration-200 disabled:opacity-60"
              style={{
                background: running ? "#192e48" : "linear-gradient(135deg, #0090c8, #00c8ff)",
                color: running ? "#4a6d8a" : "#070d18",
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              {running ? (
                <><Cpu className="h-4 w-4 animate-pulse" />SIMULATING...</>
              ) : (
                <><Play className="h-4 w-4" />RUN SIMULATION</>
              )}
            </button>
            {results && (
              <button onClick={() => setResults(null)}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs transition-all hover:bg-[#142338]"
                style={{ border: "1px solid #192e48", color: "#4a6d8a" }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>

          {/* Results panel */}
          <div className="lg:col-span-2 space-y-4">
            {results ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(results.summary).map(([k, v]) => (
                    <div key={k} className="rounded-lg p-3 text-center" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
                      <p className="text-lg font-bold sf-mono" style={{ color: "#00c8ff" }}>{v}</p>
                      <p className="text-[10px] mt-1" style={{ color: "#4a6d8a" }}>{k}</p>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
                  <p className="text-sm font-semibold mb-4" style={{ color: "#e0ecf7" }}>
                    {scenario.label} — 24-Hour Projection
                  </p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={results.data}>
                      <defs>
                        <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00c8ff" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#00c8ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#192e48" />
                      <XAxis dataKey="hour" tick={{ fill: "#4a6d8a", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                      <YAxis tick={{ fill: "#4a6d8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0f1d2e", border: "1px solid #192e48", borderRadius: 8 }} labelStyle={{ color: "#e0ecf7" }} />
                      <Area dataKey="value" name="Projected" stroke="#00c8ff" fill="url(#simGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center rounded-lg min-h-60"
                style={{ background: "#0a1220", border: "1px dashed #192e48" }}
              >
                <Zap className="h-12 w-12 mb-3" style={{ color: "#192e48" }} />
                <p className="text-sm" style={{ color: "#4a6d8a" }}>Select a scenario and run simulation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
