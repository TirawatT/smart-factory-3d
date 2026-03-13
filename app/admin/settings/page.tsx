"use client";

import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth-store";
import { Bell, Check, Database, Globe, Lock, Save, Server } from "lucide-react";
import { useState } from "react";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-5" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
      <div className="flex items-center gap-2 mb-4" style={{ borderBottom: "1px solid #192e48", paddingBottom: "0.75rem" }}>
        <div style={{ color: "#4a6d8a" }}>{icon}</div>
        <h3 className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm" style={{ color: "#e0ecf7" }}>{label}</p>
        <p className="text-xs" style={{ color: "#4a6d8a" }}>{description}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className="relative h-6 w-11 rounded-full transition-all duration-200"
        style={{ background: value ? "#00c8ff" : "#192e48" }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full transition-all duration-200"
          style={{ left: value ? "calc(100% - 1.35rem)" : "0.125rem", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({ email: true, push: true, sms: false, critical: true, warning: true, info: false });
  const [sys, setSys] = useState({ telemetryInterval: 5, dataRetention: 30, maintenanceMode: false, debugMode: false });
  const [site, setSite] = useState({ name: "NMC Chonburi", timezone: "Asia/Bangkok", currency: "THB", language: "th-TH" });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="SYSTEM SETTINGS" subtitle="Site configuration · Notifications · System" />

      <div className="p-4 md:p-6 space-y-5 max-w-3xl">

        {/* Site info */}
        <Section title="Site Configuration" icon={<Globe className="h-4 w-4" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Site Name", value: site.name, key: "name" },
              { label: "Timezone", value: site.timezone, key: "timezone" },
              { label: "Currency", value: site.currency, key: "currency" },
              { label: "Language", value: site.language, key: "language" },
            ].map(({ label, value, key }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs" style={{ color: "#7fa3c2" }}>{label}</label>
                <input value={value} onChange={(e) => setSite((s) => ({ ...s, [key]: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "#070d18", border: "1px solid #192e48", color: "#e0ecf7" }}
                  onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
                  onBlur={(e) => (e.target.style.borderColor = "#192e48")} />
              </div>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notification Settings" icon={<Bell className="h-4 w-4" />}>
          <div className="divide-y" style={{ borderColor: "#192e48" }}>
            <Toggle label="Email Notifications" description="Send alert emails to users" value={notif.email} onChange={(v) => setNotif((n) => ({ ...n, email: v }))} />
            <Toggle label="Push Notifications" description="Browser push notifications" value={notif.push} onChange={(v) => setNotif((n) => ({ ...n, push: v }))} />
            <Toggle label="SMS Alerts" description="Send SMS for critical alerts" value={notif.sms} onChange={(v) => setNotif((n) => ({ ...n, sms: v }))} />
            <div className="pt-3 pb-1">
              <p className="text-xs font-medium mb-2" style={{ color: "#7fa3c2" }}>Alert Severity Levels</p>
            </div>
            <Toggle label="Critical Alerts" description="Always notify for critical events" value={notif.critical} onChange={(v) => setNotif((n) => ({ ...n, critical: v }))} />
            <Toggle label="Warning Alerts"  description="Notify for warning-level events"  value={notif.warning}  onChange={(v) => setNotif((n) => ({ ...n, warning: v }))} />
            <Toggle label="Info Alerts"     description="Notify for informational events"  value={notif.info}     onChange={(v) => setNotif((n) => ({ ...n, info: v }))} />
          </div>
        </Section>

        {/* System */}
        <Section title="System Configuration" icon={<Server className="h-4 w-4" />}>
          <div className="divide-y mb-4" style={{ borderColor: "#192e48" }}>
            <Toggle label="Maintenance Mode" description="Disable control commands for all operators" value={sys.maintenanceMode} onChange={(v) => setSys((s) => ({ ...s, maintenanceMode: v }))} />
            <Toggle label="Debug Mode" description="Log verbose telemetry for diagnostics" value={sys.debugMode} onChange={(v) => setSys((s) => ({ ...s, debugMode: v }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs" style={{ color: "#7fa3c2" }}>Telemetry Interval (seconds)</label>
              <input type="number" min={1} max={60} value={sys.telemetryInterval}
                onChange={(e) => setSys((s) => ({ ...s, telemetryInterval: +e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "#070d18", border: "1px solid #192e48", color: "#e0ecf7" }}
                onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
                onBlur={(e) => (e.target.style.borderColor = "#192e48")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs" style={{ color: "#7fa3c2" }}>Raw Data Retention (days)</label>
              <input type="number" min={7} max={365} value={sys.dataRetention}
                onChange={(e) => setSys((s) => ({ ...s, dataRetention: +e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "#070d18", border: "1px solid #192e48", color: "#e0ecf7" }}
                onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
                onBlur={(e) => (e.target.style.borderColor = "#192e48")} />
            </div>
          </div>
        </Section>

        {/* System info */}
        <Section title="System Info" icon={<Database className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Platform Version", "v1.0.0"],
              ["Database", "PostgreSQL 15 (Mock)"],
              ["Cache", "Redis Cluster (Mock)"],
              ["Logged In As", user?.fullName ?? "—"],
              ["Role", user?.role ?? "—"],
              ["Session", "Active"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md px-3 py-2" style={{ background: "#070d18", border: "1px solid #192e48" }}>
                <p className="text-[10px]" style={{ color: "#4a6d8a" }}>{k}</p>
                <p className="text-xs font-medium sf-mono" style={{ color: "#7fa3c2" }}>{v}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Save button */}
        <div className="flex justify-end gap-3">
          <button onClick={handleSave}
            className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-200"
            style={{
              background: saved ? "rgba(0,255,157,0.15)" : "linear-gradient(135deg, #0090c8, #00c8ff)",
              color: saved ? "#00ff9d" : "#070d18",
              border: saved ? "1px solid rgba(0,255,157,0.3)" : "none",
            }}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}
