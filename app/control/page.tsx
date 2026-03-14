"use client";

import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useDevices, useControlDevice } from "@/lib/hooks/use-devices";
import { Device } from "@/lib/types";
import { format } from "date-fns";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Power,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CommandRecord {
  id: string;
  deviceName: string;
  action: string;
  params: string;
  status: "success" | "failed" | "pending";
  user: string;
  time: number;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG = {
  online:  { color: "#00ff9d", label: "Online" },
  offline: { color: "#4a6d8a", label: "Offline" },
  warning: { color: "#ffb800", label: "Warning" },
  critical:{ color: "#ff4560", label: "Critical" },
};

// ── Slider control ─────────────────────────────────────────────────────────────

function SliderControl({
  label, unit, value, min, max, step = 1, disabled, onChange,
}: {
  label: string; unit: string; value: number;
  min: number; max: number; step?: number;
  disabled?: boolean; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span style={{ color: "#7fa3c2" }}>{label}</span>
        <span className="sf-mono font-bold" style={{ color: "#00c8ff" }}>
          {value.toFixed(0)} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: disabled
            ? "#192e48"
            : `linear-gradient(to right, #00c8ff ${pct}%, #192e48 ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-[10px] sf-mono" style={{ color: "#4a6d8a" }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ControlPage() {
  const { data: devices = [] } = useDevices();
  const { mutate: sendCommand } = useControlDevice();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);

  const canStart  = hasPermission("iot.control.start");
  const canAdjust = hasPermission("iot.control.adjust");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [commands, setCommands] = useState<CommandRecord[]>([]);

  // initialise running state from device status
  useEffect(() => {
    if (devices.length === 0) return;
    const init: Record<string, boolean> = {};
    devices.forEach((d) => { init[d.id] = d.status === "online"; });
    setRunning((r) => ({ ...init, ...r }));
  }, [devices.length]);

  // initialise slider values from first sensor of each device
  useEffect(() => {
    if (!selectedDevice) return;
    const vals: Record<string, number> = {};
    selectedDevice.sensors.forEach((s) => { vals[s.id] = s.currentValue; });
    setSliderValues(vals);
  }, [selectedDevice?.id]);

  const addCommand = (deviceName: string, action: string, params = "", status: CommandRecord["status"] = "success") => {
    setCommands((prev) => [
      {
        id: crypto.randomUUID(),
        deviceName,
        action,
        params,
        status,
        user: user?.fullName ?? "Unknown",
        time: Date.now(),
      },
      ...prev.slice(0, 19),
    ]);
  };

  const toggleDevice = (device: Device) => {
    if (!canStart) return;
    const next = !running[device.id];
    setRunning((r) => ({ ...r, [device.id]: next }));
    sendCommand({ deviceId: device.id, command: next ? "start" : "stop" });
    addCommand(device.name, next ? "START" : "STOP");
  };

  const handleSliderChange = (device: Device, sensorId: string, value: number) => {
    if (!canAdjust) return;
    setSliderValues((v) => ({ ...v, [sensorId]: value }));
    sendCommand({ deviceId: device.id, command: "adjust", params: { sensorId, value } });
    addCommand(device.name, "SET_PARAM", `sensor=${sensorId} value=${value.toFixed(1)}`);
  };

  const filteredDevices = devices.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.zone.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="IOT CONTROL" subtitle="Send commands to connected devices" />

      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 md:p-6 overflow-hidden">

        {/* ── Device list (left 40%) ──────────────────────────────────────── */}
        <div className="lg:w-2/5 flex flex-col gap-3">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#4a6d8a" }} />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search device or zone..."
                className="w-full rounded-lg pl-9 pr-3 py-2 text-xs outline-none"
                style={{ background: "#0a1220", border: "1px solid #192e48", color: "#e0ecf7" }}
                onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
                onBlur={(e) => (e.target.style.borderColor = "#192e48")}
              />
            </div>
            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg px-3 py-2 text-xs outline-none"
              style={{ background: "#0a1220", border: "1px solid #192e48", color: "#7fa3c2" }}
            >
              {["all","online","offline","warning","critical"].map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Device cards */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-260px)]">
            {filteredDevices.map((device) => {
              const cfg = STATUS_CFG[device.status];
              const isSelected = selectedDevice?.id === device.id;
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className="w-full text-left rounded-lg p-3 transition-all duration-200"
                  style={{
                    background: isSelected ? "rgba(0,200,255,0.08)" : "#0a1220",
                    border: isSelected ? "1px solid rgba(0,200,255,0.4)" : "1px solid #192e48",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
                    >
                      <Cpu className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#e0ecf7" }}>{device.name}</p>
                      <p className="text-[10px]" style={{ color: "#4a6d8a" }}>{device.zone}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] sf-mono" style={{ color: cfg.color }}>{cfg.label}</span>
                      <div className="h-2 w-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}80` }} />
                      {isSelected && <ChevronRight className="h-3.5 w-3.5" style={{ color: "#00c8ff" }} />}
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredDevices.length === 0 && (
              <p className="py-8 text-center text-sm" style={{ color: "#4a6d8a" }}>No devices match</p>
            )}
          </div>
        </div>

        {/* ── Right panel (60%) ────────────────────────────────────────────── */}
        <div className="lg:w-3/5 flex flex-col gap-4">

          {selectedDevice ? (
            <>
              {/* Control panel */}
              <div className="rounded-lg p-5 space-y-5" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold" style={{ color: "#e0ecf7" }}>{selectedDevice.name}</h2>
                    <p className="text-xs" style={{ color: "#4a6d8a" }}>{selectedDevice.zone} · {selectedDevice.location}</p>
                  </div>
                  {/* Power toggle */}
                  <button
                    onClick={() => toggleDevice(selectedDevice)}
                    disabled={!canStart}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 disabled:opacity-40"
                    style={
                      running[selectedDevice.id]
                        ? { background: "rgba(255,69,96,0.15)", border: "1px solid rgba(255,69,96,0.4)", color: "#ff4560" }
                        : { background: "rgba(0,255,157,0.15)", border: "1px solid rgba(0,255,157,0.4)", color: "#00ff9d" }
                    }
                  >
                    <Power className="h-4 w-4" />
                    {running[selectedDevice.id] ? "STOP" : "START"}
                  </button>
                </div>

                {/* Status row */}
                <div className="flex items-center gap-3 rounded-md px-4 py-2.5"
                  style={{ background: "#070d18", border: "1px solid #192e48" }}
                >
                  <Activity className="h-4 w-4" style={{ color: running[selectedDevice.id] ? "#00ff9d" : "#4a6d8a" }} />
                  <span className="text-xs sf-mono" style={{ color: running[selectedDevice.id] ? "#00ff9d" : "#4a6d8a" }}>
                    {running[selectedDevice.id] ? "RUNNING" : "STOPPED"}
                  </span>
                  <span className="mx-2 text-[#192e48]">|</span>
                  <span className="text-xs" style={{ color: "#4a6d8a" }}>{selectedDevice.sensors.length} sensors</span>
                  {!canStart && (
                    <Badge variant="outline" className="ml-auto text-[10px] border-[#1e3c60]" style={{ color: "#4a6d8a" }}>
                      View only
                    </Badge>
                  )}
                </div>

                {/* Sensor sliders */}
                {selectedDevice.sensors.length > 0 && (
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" style={{ color: "#4a6d8a" }} />
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#4a6d8a" }}>Parameters</span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {selectedDevice.sensors.map((sensor) => (
                        <SliderControl
                          key={sensor.id}
                          label={sensor.name}
                          unit={sensor.unit}
                          value={sliderValues[sensor.id] ?? sensor.currentValue}
                          min={sensor.min}
                          max={sensor.max}
                          disabled={!canAdjust || !running[selectedDevice.id]}
                          onChange={(v) => handleSliderChange(selectedDevice, sensor.id, v)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Command history */}
              <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" style={{ color: "#4a6d8a" }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#4a6d8a" }}>Command History</span>
                </div>
                {commands.length === 0 ? (
                  <p className="py-4 text-center text-xs" style={{ color: "#4a6d8a" }}>No commands sent yet</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {commands.map((cmd) => (
                      <div key={cmd.id} className="flex items-center gap-3 rounded-md px-3 py-2"
                        style={{ background: "#070d18", border: "1px solid #192e48" }}
                      >
                        {cmd.status === "success"
                          ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "#00ff9d" }} />
                          : <XCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#ff4560" }} />
                        }
                        <span className="text-xs font-mono font-bold" style={{ color: "#00c8ff" }}>{cmd.action}</span>
                        {cmd.params && <span className="text-[10px] sf-mono" style={{ color: "#4a6d8a" }}>{cmd.params}</span>}
                        <span className="ml-auto text-[10px] sf-mono shrink-0" style={{ color: "#4a6d8a" }}>
                          {format(new Date(cmd.time), "HH:mm:ss")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center rounded-lg"
              style={{ background: "#0a1220", border: "1px dashed #192e48" }}
            >
              <Cpu className="h-12 w-12 mb-3" style={{ color: "#192e48" }} />
              <p className="text-sm" style={{ color: "#4a6d8a" }}>Select a device to control</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
