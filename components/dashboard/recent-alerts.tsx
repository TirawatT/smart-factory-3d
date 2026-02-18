"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertSeverity } from "@/lib/types";
import { useRealtimeStore } from "@/stores/realtime-store";
import { format } from "date-fns";
import { AlertTriangle, Check, Info, XCircle } from "lucide-react";

const severityConfig: Record<
  AlertSeverity,
  { color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  critical: {
    color: "#ff4560",
    bgColor: "rgba(255,69,96,0.08)",
    borderColor: "rgba(255,69,96,0.2)",
    icon: <XCircle className="h-4 w-4" style={{ color: "#ff4560" }} />,
  },
  warning: {
    color: "#ffb800",
    bgColor: "rgba(255,184,0,0.08)",
    borderColor: "rgba(255,184,0,0.2)",
    icon: <AlertTriangle className="h-4 w-4" style={{ color: "#ffb800" }} />,
  },
  info: {
    color: "#00c8ff",
    bgColor: "rgba(0,200,255,0.08)",
    borderColor: "rgba(0,200,255,0.2)",
    icon: <Info className="h-4 w-4" style={{ color: "#00c8ff" }} />,
  },
};

export function RecentAlerts() {
  const alerts = useRealtimeStore((s) => s.alerts);
  const acknowledgeAlert = useRealtimeStore((s) => s.acknowledgeAlert);
  const recentAlerts = alerts.slice(0, 6);

  return (
    <div className="rounded-lg p-4 sf-card">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-4 w-1 rounded-full"
          style={{ background: "linear-gradient(180deg, #ff4560, #ffb800)" }}
        />
        <h3 className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>
          Recent Alerts
        </h3>
        {recentAlerts.length > 0 && (
          <span
            className="ml-auto text-[10px] sf-mono px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,69,96,0.1)", color: "#ff4560" }}
          >
            {recentAlerts.filter((a) => !a.acknowledged).length} ACTIVE
          </span>
        )}
      </div>
      {recentAlerts.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "#4a6d8a" }}>
          No alerts
        </p>
      ) : (
        <div className="space-y-2">
          {recentAlerts.map((alert) => {
            const cfg = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-3 rounded-md p-3 transition-all duration-200"
                style={{
                  background: cfg.bgColor,
                  border: `1px solid ${cfg.borderColor}`,
                }}
              >
                <div className="flex gap-2.5 min-w-0 flex-1">
                  <div className="mt-0.5 shrink-0">{cfg.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-0 px-1.5 py-0 uppercase sf-mono"
                        style={{
                          background: `${cfg.color}20`,
                          color: cfg.color,
                        }}
                      >
                        {alert.severity}
                      </Badge>
                      <span
                        className="truncate text-sm font-medium"
                        style={{ color: "#e0ecf7" }}
                      >
                        {alert.deviceName}
                      </span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: "#7fa3c2" }}>
                      {alert.message}
                    </p>
                    <p
                      className="mt-1 text-[10px] sf-mono"
                      style={{ color: "#4a6d8a" }}
                    >
                      {format(new Date(alert.timestamp), "dd MMM HH:mm:ss")}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 hover:bg-[#142338]"
                    onClick={() => acknowledgeAlert(alert.id)}
                    title="Acknowledge"
                  >
                    <Check className="h-4 w-4" style={{ color: "#00ff9d" }} />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
