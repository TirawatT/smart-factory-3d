"use client";

import { Header } from "@/components/layout/header";
import { CheckCircle, Download, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  timestamp: number;
  user: string;
  role: string;
  action: string;
  resource: string;
  result: "success" | "failure";
  ip: string;
  detail: string;
}

const MOCK_LOGS: AuditLog[] = [
  { id: "log-001", timestamp: Date.now() - 2 * 60000,  user: "admin@factory.com",    role: "admin",    action: "auth.login",          resource: "user",   result: "success", ip: "192.168.1.10", detail: "Login successful" },
  { id: "log-002", timestamp: Date.now() - 5 * 60000,  user: "operator@factory.com", role: "operator", action: "iot.control.start",   resource: "device", result: "success", ip: "192.168.1.22", detail: "Started CNC-001" },
  { id: "log-003", timestamp: Date.now() - 8 * 60000,  user: "manager@factory.com",  role: "manager",  action: "alert.acknowledge",   resource: "alert",  result: "success", ip: "192.168.1.15", detail: "Ack alert-003" },
  { id: "log-004", timestamp: Date.now() - 12 * 60000, user: "guest@factory.com",    role: "guest",    action: "iot.control.start",   resource: "device", result: "failure", ip: "192.168.1.50", detail: "Permission denied" },
  { id: "log-005", timestamp: Date.now() - 18 * 60000, user: "admin@factory.com",    role: "admin",    action: "user.create",         resource: "user",   result: "success", ip: "192.168.1.10", detail: "Created user somchai@factory.com" },
  { id: "log-006", timestamp: Date.now() - 25 * 60000, user: "operator@factory.com", role: "operator", action: "auth.login",          resource: "user",   result: "failure", ip: "10.0.0.5",     detail: "Invalid password (attempt 2/5)" },
  { id: "log-007", timestamp: Date.now() - 32 * 60000, user: "manager@factory.com",  role: "manager",  action: "analytics.export",    resource: "report", result: "success", ip: "192.168.1.15", detail: "Exported OEE report PDF" },
  { id: "log-008", timestamp: Date.now() - 45 * 60000, user: "admin@factory.com",    role: "admin",    action: "device.manage.update",resource: "device", result: "success", ip: "192.168.1.10", detail: "Updated firmware CNC-001 to v2.1.3" },
  { id: "log-009", timestamp: Date.now() - 60 * 60000, user: "operator@factory.com", role: "operator", action: "iot.control.stop",    resource: "device", result: "success", ip: "192.168.1.22", detail: "Stopped PUMP-003 for maintenance" },
  { id: "log-010", timestamp: Date.now() - 90 * 60000, user: "admin@factory.com",    role: "admin",    action: "auth.logout",         resource: "user",   result: "success", ip: "192.168.1.10", detail: "Session ended" },
  { id: "log-011", timestamp: Date.now() - 2 * 3600000,user: "manager@factory.com",  role: "manager",  action: "alert.resolve",       resource: "alert",  result: "success", ip: "192.168.1.15", detail: "Resolved alert-001: temperature OK" },
  { id: "log-012", timestamp: Date.now() - 3 * 3600000,user: "unknown",              role: "—",        action: "auth.login",          resource: "user",   result: "failure", ip: "203.45.12.7",  detail: "Unknown email — possible intrusion attempt" },
];

const ACTION_COLORS: Record<string, string> = {
  "auth":     "#00c8ff",
  "iot":      "#00ff9d",
  "alert":    "#ffb800",
  "user":     "#8b5cf6",
  "device":   "#06b6d4",
  "analytics":"#f59e0b",
};

function getActionColor(action: string) {
  const prefix = action.split(".")[0];
  return ACTION_COLORS[prefix] ?? "#7fa3c2";
}

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<"all" | "success" | "failure">("all");

  const filtered = useMemo(() => MOCK_LOGS.filter((l) => {
    if (resultFilter !== "all" && l.result !== resultFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.user.includes(q) || l.action.includes(q) || l.resource.includes(q) || l.detail.toLowerCase().includes(q) || l.ip.includes(q);
    }
    return true;
  }), [search, resultFilter]);

  const stats = { total: MOCK_LOGS.length, success: MOCK_LOGS.filter((l) => l.result === "success").length, failure: MOCK_LOGS.filter((l) => l.result === "failure").length };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="AUDIT TRAIL" subtitle="Tamper-proof activity log · All actions recorded" />

      <div className="p-4 md:p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Events", value: stats.total, color: "#7fa3c2" },
            { label: "Success", value: stats.success, color: "#00ff9d" },
            { label: "Failure", value: stats.failure, color: "#ff4560" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg px-4 py-3 text-center" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <p className="text-2xl font-bold sf-mono" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] mt-1" style={{ color: "#4a6d8a" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#4a6d8a" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search user, action, IP..."
              className="w-full rounded-lg pl-9 pr-3 py-2 text-xs outline-none"
              style={{ background: "#0a1220", border: "1px solid #192e48", color: "#e0ecf7" }}
              onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
              onBlur={(e) => (e.target.style.borderColor = "#192e48")} />
          </div>
          <div className="flex gap-1">
            {(["all","success","failure"] as const).map((f) => (
              <button key={f} onClick={() => setResultFilter(f)}
                className="rounded-md px-3 py-2 text-xs capitalize transition-all"
                style={resultFilter === f
                  ? { background: f === "failure" ? "rgba(255,69,96,0.15)" : "rgba(0,200,255,0.15)", color: f === "failure" ? "#ff4560" : "#00c8ff", border: `1px solid ${f === "failure" ? "rgba(255,69,96,0.3)" : "rgba(0,200,255,0.3)"}` }
                  : { background: "transparent", color: "#4a6d8a", border: "1px solid transparent" }
                }>
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-all hover:bg-[#142338]"
            style={{ border: "1px solid #192e48", color: "#7fa3c2" }}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>

        {/* Log table */}
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #192e48" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ background: "#0a1220" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #192e48" }}>
                  {["Timestamp","User","Action","Resource","Result","IP","Detail"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider whitespace-nowrap" style={{ color: "#4a6d8a" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#192e48" }}>
                {filtered.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-[#0f1d2e]">
                    <td className="px-4 py-3 sf-mono whitespace-nowrap" style={{ color: "#4a6d8a" }}>
                      {format(new Date(log.timestamp), "dd MMM HH:mm:ss")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#e0ecf7" }}>{log.user}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="sf-mono" style={{ color: getActionColor(log.action) }}>{log.action}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#7fa3c2" }}>{log.resource}</td>
                    <td className="px-4 py-3">
                      {log.result === "success"
                        ? <CheckCircle className="h-4 w-4" style={{ color: "#00ff9d" }} />
                        : <XCircle className="h-4 w-4" style={{ color: "#ff4560" }} />
                      }
                    </td>
                    <td className="px-4 py-3 sf-mono" style={{ color: "#4a6d8a" }}>{log.ip}</td>
                    <td className="px-4 py-3 max-w-xs truncate" style={{ color: "#7fa3c2" }}>{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 text-[10px] sf-mono" style={{ borderTop: "1px solid #192e48", color: "#4a6d8a" }}>
            Showing {filtered.length} of {MOCK_LOGS.length} entries · Audit logs are append-only and tamper-proof
          </div>
        </div>
      </div>
    </div>
  );
}
