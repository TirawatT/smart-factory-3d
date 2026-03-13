import { NextRequest, NextResponse } from "next/server";

const AUDIT_LOGS = [
  { id: "log-001", timestamp: Date.now() - 2 * 60000,      user: "admin@factory.com",    role: "admin",    action: "auth.login",          resource: "user",   result: "success", ip: "192.168.1.10", detail: "Login successful" },
  { id: "log-002", timestamp: Date.now() - 5 * 60000,      user: "operator@factory.com", role: "operator", action: "iot.control.start",   resource: "device", result: "success", ip: "192.168.1.22", detail: "Started CNC-001" },
  { id: "log-003", timestamp: Date.now() - 8 * 60000,      user: "manager@factory.com",  role: "manager",  action: "alert.acknowledge",   resource: "alert",  result: "success", ip: "192.168.1.15", detail: "Ack alert-003" },
  { id: "log-004", timestamp: Date.now() - 12 * 60000,     user: "guest@factory.com",    role: "guest",    action: "iot.control.start",   resource: "device", result: "failure", ip: "192.168.1.50", detail: "Permission denied" },
  { id: "log-005", timestamp: Date.now() - 18 * 60000,     user: "admin@factory.com",    role: "admin",    action: "user.create",         resource: "user",   result: "success", ip: "192.168.1.10", detail: "Created user somchai@factory.com" },
  { id: "log-006", timestamp: Date.now() - 25 * 60000,     user: "operator@factory.com", role: "operator", action: "auth.login",          resource: "user",   result: "failure", ip: "10.0.0.5",     detail: "Invalid password (attempt 2/5)" },
  { id: "log-007", timestamp: Date.now() - 32 * 60000,     user: "manager@factory.com",  role: "manager",  action: "analytics.export",    resource: "report", result: "success", ip: "192.168.1.15", detail: "Exported OEE report PDF" },
  { id: "log-008", timestamp: Date.now() - 45 * 60000,     user: "admin@factory.com",    role: "admin",    action: "device.manage.update",resource: "device", result: "success", ip: "192.168.1.10", detail: "Updated firmware CNC-001 to v2.1.3" },
  { id: "log-009", timestamp: Date.now() - 60 * 60000,     user: "operator@factory.com", role: "operator", action: "iot.control.stop",    resource: "device", result: "success", ip: "192.168.1.22", detail: "Stopped PUMP-003 for maintenance" },
  { id: "log-010", timestamp: Date.now() - 90 * 60000,     user: "admin@factory.com",    role: "admin",    action: "auth.logout",         resource: "user",   result: "success", ip: "192.168.1.10", detail: "Session ended" },
  { id: "log-011", timestamp: Date.now() - 2 * 3600000,    user: "manager@factory.com",  role: "manager",  action: "alert.resolve",       resource: "alert",  result: "success", ip: "192.168.1.15", detail: "Resolved alert-001: temperature OK" },
  { id: "log-012", timestamp: Date.now() - 3 * 3600000,    user: "unknown",              role: "—",        action: "auth.login",          resource: "user",   result: "failure", ip: "203.45.12.7",  detail: "Unknown email — possible intrusion attempt" },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const result = searchParams.get("result");

  let logs = [...AUDIT_LOGS];
  if (result && result !== "all") logs = logs.filter((l) => l.result === result);
  if (search) {
    const q = search.toLowerCase();
    logs = logs.filter((l) =>
      l.user.includes(q) || l.action.includes(q) || l.resource.includes(q) ||
      l.detail.toLowerCase().includes(q) || l.ip.includes(q)
    );
  }

  return NextResponse.json(logs);
}
