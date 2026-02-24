"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Flame,
  Maximize2,
  Minimize2,
  Settings,
  ShieldAlert,
  Waves,
} from "lucide-react";
import { useState } from "react";

// ─── Scenario definitions ────────────────────────────────────────────────────
export interface Scenario {
  id: string;
  label: string;
  labelTH: string;
  icon: React.ReactNode;
  color: string; // active accent colour
  colorDim: string; // dimmed version
  colorBg: string; // translucent fill
  defaultUrl: string;
}

const DEFAULT_3D_URL = "/src_3d/IndustrialWorkshopFoundry2/index.htm";

const SCENARIOS: Scenario[] = [
  {
    id: "normal",
    label: "Normal",
    labelTH: "ปกติ",
    icon: <ShieldAlert className="h-4 w-4" />,
    color: "#00c8ff",
    colorDim: "rgba(0,200,255,0.15)",
    colorBg: "rgba(0,200,255,0.07)",
    defaultUrl: DEFAULT_3D_URL,
  },
  {
    id: "fire",
    label: "Fire",
    labelTH: "ไฟไหม้",
    icon: <Flame className="h-4 w-4" />,
    color: "#ff4560",
    colorDim: "rgba(255,69,96,0.15)",
    colorBg: "rgba(255,69,96,0.07)",
    defaultUrl: DEFAULT_3D_URL,
  },
  {
    id: "flood",
    label: "Flood",
    labelTH: "น้ำท่วม",
    icon: <Waves className="h-4 w-4" />,
    color: "#00b4d8",
    colorDim: "rgba(0,180,216,0.15)",
    colorBg: "rgba(0,180,216,0.07)",
    defaultUrl: DEFAULT_3D_URL,
  },
  {
    id: "earthquake",
    label: "Earthquake",
    labelTH: "แผ่นดินไหว",
    icon: <Activity className="h-4 w-4" />,
    color: "#ffb800",
    colorDim: "rgba(255,184,0,0.15)",
    colorBg: "rgba(255,184,0,0.07)",
    defaultUrl: DEFAULT_3D_URL,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function SecurityViewer() {
  const [activeId, setActiveId] = useState("normal");
  const [urls, setUrls] = useState<Record<string, string>>(
    Object.fromEntries(SCENARIOS.map((s) => [s.id, s.defaultUrl])),
  );
  const [editUrls, setEditUrls] = useState<Record<string, string>>({ ...urls });
  const [showConfig, setShowConfig] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const active = SCENARIOS.find((s) => s.id === activeId)!;
  const currentUrl = urls[activeId];

  function handleSaveConfig() {
    setUrls({ ...editUrls });
    setShowConfig(false);
  }

  return (
    <div
      className={`flex flex-col overflow-hidden ${fullscreen ? "fixed inset-0 z-50" : "h-full"}`}
      style={{ background: "#070d18" }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
        style={{
          background: "linear-gradient(90deg, #0b1520, #0f1d2e)",
          borderBottom: "1px solid #192e48",
          flexShrink: 0,
        }}
      >
        {/* Scenario pills */}
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => {
            const isActive = activeId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.05em",
                  fontSize: "13px",
                  color: isActive
                    ? s.id === "normal"
                      ? "#070d18"
                      : "#070d18"
                    : s.color,
                  background: isActive ? s.color : s.colorBg,
                  border: `1px solid ${isActive ? s.color : s.colorDim}`,
                  boxShadow: isActive ? `0 0 12px ${s.color}55` : "none",
                }}
              >
                <span
                  style={{
                    color: isActive ? "#070d18" : s.color,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {s.icon}
                </span>
                <span>{s.label}</span>
                <span
                  style={{
                    fontSize: "11px",
                    opacity: 0.75,
                    color: isActive ? "#070d18" : "#7fa3c2",
                  }}
                >
                  ({s.labelTH})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[#142338]"
            title="Configure 3D URLs"
            onClick={() => setShowConfig((v) => !v)}
          >
            <Settings
              className="h-4 w-4"
              style={{ color: showConfig ? "#00c8ff" : "#7fa3c2" }}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[#142338]"
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={() => setFullscreen((v) => !v)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" style={{ color: "#7fa3c2" }} />
            ) : (
              <Maximize2 className="h-4 w-4" style={{ color: "#7fa3c2" }} />
            )}
          </Button>
        </div>
      </div>

      {/* ── Config panel ── */}
      {showConfig && (
        <div
          className="space-y-3 px-4 py-3"
          style={{
            background: "#0f1d2e",
            borderBottom: "1px solid #192e48",
            flexShrink: 0,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#7fa3c2" }}
          >
            Configure 3D URL for each scenario
          </p>
          {SCENARIOS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span
                className="flex w-28 shrink-0 items-center gap-1.5 text-xs font-semibold"
                style={{ color: s.color }}
              >
                {s.icon} {s.label}
              </span>
              <Input
                value={editUrls[s.id]}
                onChange={(e) =>
                  setEditUrls((prev) => ({ ...prev, [s.id]: e.target.value }))
                }
                placeholder="3D view URL or /src_3d/..."
                className="h-8 flex-1 border-[#192e48] bg-[#0b1520] text-xs text-[#e0ecf7] placeholder:text-[#4a6d8a]"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-[#192e48] bg-[#0b1520] text-xs text-[#7fa3c2] hover:bg-[#142338]"
              onClick={() => {
                setEditUrls({ ...urls });
                setShowConfig(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 bg-[#00c8ff] text-xs font-semibold text-[#070d18] hover:bg-[#00b0e0]"
              onClick={handleSaveConfig}
            >
              Save & Apply
            </Button>
          </div>
        </div>
      )}

      {/* ── Active scenario label strip ── */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{
          background: active.colorBg,
          borderBottom: `1px solid ${active.colorDim}`,
          flexShrink: 0,
        }}
      >
        <span
          style={{ color: active.color, display: "flex", alignItems: "center" }}
        >
          {active.icon}
        </span>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: active.color,
            textShadow: `0 0 8px ${active.color}88`,
          }}
        >
          {active.label} — {active.labelTH}
        </span>
        <span
          className="ml-auto text-[11px]"
          style={{ color: "#4a6d8a", fontFamily: "monospace" }}
        >
          {currentUrl}
        </span>
      </div>

      {/* ── 3D iframe ── */}
      <div className="relative flex-1 overflow-hidden">
        {currentUrl ? (
          <iframe
            key={`${activeId}-${currentUrl}`}
            src={currentUrl}
            className="h-full w-full border-0"
            allow="fullscreen; xr-spatial-tracking"
            allowFullScreen
            title={`Security 3D — ${active.label}`}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center sf-grid-bg">
            <ShieldAlert className="h-16 w-16" style={{ color: "#192e48" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>
                No 3D URL configured
              </p>
              <p className="mt-1 text-xs" style={{ color: "#4a6d8a" }}>
                Click the{" "}
                <Settings
                  className="inline h-3 w-3"
                  style={{ color: "#00c8ff" }}
                />{" "}
                icon to set the 3D view URL for this scenario.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-[#192e48] bg-[#0b1520] text-[#00c8ff] hover:bg-[#142338]"
              onClick={() => setShowConfig(true)}
            >
              Configure URL
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
