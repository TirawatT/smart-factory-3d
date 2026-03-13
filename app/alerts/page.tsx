"use client";

import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAcknowledgeAlert, useAcknowledgeAllAlerts, useAlerts } from "@/lib/hooks/use-alerts";
import { DeviceAlert } from "@/lib/types";
import { format } from "date-fns";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Filter,
  Info,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// ── Severity config ───────────────────────────────────────────────────────────

type Severity = "critical" | "warning" | "info";

const SEV_CFG: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  critical: {
    label: "Critical",
    color: "#ff4560",
    bg: "rgba(255,69,96,0.08)",
    border: "rgba(255,69,96,0.25)",
    icon: <XCircle className="h-4 w-4 shrink-0" style={{ color: "#ff4560" }} />,
  },
  warning: {
    label: "Warning",
    color: "#ffb800",
    bg: "rgba(255,184,0,0.08)",
    border: "rgba(255,184,0,0.25)",
    icon: <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: "#ffb800" }} />,
  },
  info: {
    label: "Info",
    color: "#00c8ff",
    bg: "rgba(0,200,255,0.08)",
    border: "rgba(0,200,255,0.25)",
    icon: <Info className="h-4 w-4 shrink-0" style={{ color: "#00c8ff" }} />,
  },
};

// ── Alert card ────────────────────────────────────────────────────────────────

function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
}: {
  alert: DeviceAlert;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const cfg = SEV_CFG[alert.severity];

  return (
    <div
      className="rounded-lg p-4 transition-all duration-200 hover:brightness-110"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{cfg.icon}</div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-[10px] border-0 px-1.5 py-0 uppercase sf-mono shrink-0"
              style={{ background: `${cfg.color}20`, color: cfg.color }}
            >
              {cfg.label}
            </Badge>
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "#e0ecf7" }}
            >
              {alert.deviceName}
            </span>
            {alert.acknowledged && (
              <Badge
                variant="outline"
                className="text-[10px] border-0 px-1.5 py-0 uppercase sf-mono shrink-0"
                style={{
                  background: "rgba(0,255,157,0.1)",
                  color: "#00ff9d",
                }}
              >
                Acknowledged
              </Badge>
            )}
          </div>

          {/* Message */}
          <p className="mt-1 text-sm" style={{ color: "#7fa3c2" }}>
            {alert.message}
          </p>

          {/* Sensor / value row */}
          <div className="mt-2 flex items-center gap-4 flex-wrap">
            <span className="text-xs sf-mono" style={{ color: "#4a6d8a" }}>
              Sensor:{" "}
              <span style={{ color: "#7fa3c2" }}>{alert.sensorName}</span>
            </span>
            <span className="text-xs sf-mono" style={{ color: "#4a6d8a" }}>
              Value:{" "}
              <span style={{ color: cfg.color, fontWeight: 600 }}>
                {alert.value.toFixed(1)}
              </span>{" "}
              / threshold{" "}
              <span style={{ color: "#7fa3c2" }}>{alert.threshold}</span>
            </span>
            <span className="text-xs sf-mono" style={{ color: "#4a6d8a" }}>
              {format(new Date(alert.timestamp), "dd MMM yyyy · HH:mm:ss")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!alert.acknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              title="Acknowledge"
              className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:bg-[#0a1e10]"
              style={{ color: "#00ff9d" }}
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onResolve(alert.id)}
            title="Resolve & dismiss"
            className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:bg-[#1a0a0a]"
            style={{ color: "#4a6d8a" }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "active" | "acknowledged";
type SeverityFilter = "all" | Severity;

export default function AlertsPage() {
  const { data: alerts = [] } = useAlerts();
  const ackMutation = useAcknowledgeAlert();
  const ackAllMutation = useAcknowledgeAllAlerts();
  const acknowledgeAlert = (id: string) => ackMutation.mutate(id);
  const dismissAlert = (id: string) => ackMutation.mutate(id);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: alerts.length,
    active: alerts.filter((a) => !a.acknowledged).length,
    critical: alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length,
    acknowledged: alerts.filter((a) => a.acknowledged).length,
  }), [alerts]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      if (statusFilter === "active" && a.acknowledged) return false;
      if (statusFilter === "acknowledged" && !a.acknowledged) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.deviceName.toLowerCase().includes(q) &&
          !a.message.toLowerCase().includes(q) &&
          !a.sensorName.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, statusFilter, search]);

  const acknowledgeAll = () => ackAllMutation.mutate();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header
        title="ALERTS"
        subtitle={`${stats.active} active · ${stats.total} total`}
      />

      <div className="flex-1 p-4 md:p-6 space-y-5">

        {/* ── Stats cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Alerts", value: stats.total, color: "#7fa3c2" },
            { label: "Active", value: stats.active, color: "#ffb800" },
            { label: "Critical", value: stats.critical, color: "#ff4560" },
            { label: "Acknowledged", value: stats.acknowledged, color: "#00ff9d" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg px-4 py-3 flex items-center gap-3"
              style={{
                background: "#0a1220",
                border: "1px solid #192e48",
              }}
            >
              <Bell className="h-5 w-5 shrink-0" style={{ color: s.color }} />
              <div>
                <p
                  className="text-xl font-bold sf-mono leading-none"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#4a6d8a" }}>
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div
          className="rounded-lg p-3 flex flex-wrap items-center gap-3"
          style={{ background: "#0a1220", border: "1px solid #192e48" }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
              style={{ color: "#4a6d8a" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search device, sensor, message..."
              className="w-full rounded-md pl-9 pr-3 py-1.5 text-xs outline-none"
              style={{
                background: "#070d18",
                border: "1px solid #192e48",
                color: "#e0ecf7",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
              onBlur={(e) => (e.target.style.borderColor = "#192e48")}
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 mr-1" style={{ color: "#4a6d8a" }} />
            {(["all", "active", "acknowledged"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="rounded-md px-3 py-1.5 text-xs capitalize transition-all duration-150"
                style={
                  statusFilter === s
                    ? { background: "rgba(0,200,255,0.15)", color: "#00c8ff", border: "1px solid rgba(0,200,255,0.3)" }
                    : { background: "transparent", color: "#4a6d8a", border: "1px solid transparent" }
                }
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {(["all", "critical", "warning", "info"] as SeverityFilter[]).map((s) => {
              const c = s === "all" ? "#7fa3c2" : SEV_CFG[s as Severity].color;
              return (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className="rounded-md px-3 py-1.5 text-xs capitalize transition-all duration-150"
                  style={
                    severityFilter === s
                      ? { background: `${c}20`, color: c, border: `1px solid ${c}40` }
                      : { background: "transparent", color: "#4a6d8a", border: "1px solid transparent" }
                  }
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* Acknowledge all */}
          {stats.active > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={acknowledgeAll}
              className="ml-auto text-xs h-7 px-3 hover:bg-[#0a1e10]"
              style={{ color: "#00ff9d", border: "1px solid rgba(0,255,157,0.2)" }}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
              Acknowledge all
            </Button>
          )}
        </div>

        {/* ── Alert list ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div
            className="rounded-lg flex flex-col items-center justify-center py-20"
            style={{ background: "#0a1220", border: "1px solid #192e48" }}
          >
            <Bell className="h-10 w-10 mb-3" style={{ color: "#192e48" }} />
            <p className="text-sm" style={{ color: "#4a6d8a" }}>
              No alerts match your filters
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs sf-mono" style={{ color: "#4a6d8a" }}>
              {filtered.length} alert{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledgeAlert}
                onResolve={dismissAlert}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
