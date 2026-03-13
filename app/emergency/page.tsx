"use client";

import { Header } from "@/components/layout/header";
import { AlertTriangle, CheckCircle, Flame, MapPin, Phone, Shield, Wind } from "lucide-react";
import { useState } from "react";

const EMERGENCY_CONTACTS = [
  { role: "Site Safety Officer", name: "Somchai Thongpan", phone: "+66 81-234-5678", available: true },
  { role: "Maintenance Lead",    name: "Wichai Rattana",  phone: "+66 82-345-6789", available: true },
  { role: "Shift Supervisor",    name: "Nattapong Siri",  phone: "+66 83-456-7890", available: false },
  { role: "Fire Brigade (Local)","name": "Emergency",      phone: "199",             available: true },
  { role: "Medical Emergency",   "name": "Ambulance",      phone: "1669",            available: true },
];

const EVACUATION_ROUTES = [
  {
    id: "primary",
    label: "Primary Route",
    type: "primary",
    scenario: ["fire", "chemical"],
    steps: ["Exit Zone A via Door A1", "Cross to Assembly Yard", "Assembly Point: Car Park North"],
    color: "#00ff9d",
  },
  {
    id: "alt-b",
    label: "Alternative B",
    type: "alternative",
    scenario: ["flood"],
    steps: ["Exit Zone B via Emergency Door B3", "Use stairwell to Roof Level 2", "Await rescue at helipad"],
    color: "#ffb800",
  },
  {
    id: "alt-c",
    label: "Alternative C",
    type: "alternative",
    scenario: ["earthquake"],
    steps: ["Stay under sturdy workbench", "When shaking stops, exit via nearest door", "Assembly Point: Soccer Field East"],
    color: "#00c8ff",
  },
];

const SAFETY_EQUIPMENT = [
  { zone: "Zone A - Assembly", items: [
    { type: "Fire Extinguisher", qty: 4, status: "ok", expiry: "2027-03" },
    { type: "First Aid Kit",     qty: 2, status: "ok", expiry: "2026-09" },
    { type: "AED",               qty: 1, status: "ok", expiry: "2028-01" },
    { type: "Emergency Shower",  qty: 1, status: "warning", expiry: "Inspection due" },
  ]},
  { zone: "Zone B - Packaging", items: [
    { type: "Fire Extinguisher", qty: 3, status: "ok", expiry: "2027-06" },
    { type: "First Aid Kit",     qty: 1, status: "ok", expiry: "2026-08" },
  ]},
  { zone: "Zone D - Utilities", items: [
    { type: "Fire Extinguisher", qty: 6, status: "ok", expiry: "2027-02" },
    { type: "Gas Mask",          qty: 4, status: "ok", expiry: "2026-12" },
    { type: "Emergency Shower",  qty: 2, status: "ok", expiry: "2026-11" },
  ]},
];

const PROCEDURES = [
  { id: "fire", icon: <Flame className="h-5 w-5" />, color: "#ff4560", label: "Fire", steps: [
    "Activate nearest fire alarm pull station",
    "Call 199 if fire is out of control",
    "Evacuate using Primary Route (avoid elevators)",
    "Report to Assembly Point at Car Park North",
    "Do NOT re-enter building until cleared by Fire Brigade",
  ]},
  { id: "chemical", icon: <Wind className="h-5 w-5" />, color: "#ffb800", label: "Chemical Spill", steps: [
    "Alert nearby personnel immediately",
    "Don appropriate PPE if trained; otherwise evacuate upwind",
    "Isolate the area — prevent others from entering",
    "Call Safety Officer (+66 81-234-5678)",
    "Initiate MSDS response procedure for the specific chemical",
  ]},
  { id: "medical", icon: <Shield className="h-5 w-5" />, color: "#00c8ff", label: "Medical Emergency", steps: [
    "Call 1669 for ambulance immediately",
    "Alert Site Safety Officer",
    "Do NOT move the injured person unless in immediate danger",
    "Use nearest First Aid Kit or AED if qualified",
    "Clear the area for emergency responders",
  ]},
];

export default function EmergencyPage() {
  const [activeProcedure, setActiveProcedure] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="EMERGENCY & SAFETY" subtitle="Evacuation routes · Contacts · Procedures" />

      <div className="p-4 md:p-6 space-y-5">
        {/* Emergency banner */}
        <div className="flex items-center gap-3 rounded-lg px-5 py-3"
          style={{ background: "rgba(255,69,96,0.06)", border: "1px solid rgba(255,69,96,0.25)" }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: "#ff4560" }} />
          <p className="text-sm" style={{ color: "#7fa3c2" }}>
            All clear — No active emergency. This page provides emergency response procedures and contacts.
          </p>
          <span className="ml-auto text-xs sf-mono shrink-0" style={{ color: "#00ff9d" }}>SYSTEM NORMAL</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-4">
            {/* Emergency contacts */}
            <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4" style={{ color: "#ff4560" }} />
                <p className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>Emergency Contacts</p>
              </div>
              <div className="space-y-2">
                {EMERGENCY_CONTACTS.map((c) => (
                  <div key={c.phone} className="flex items-center gap-3 rounded-md px-3 py-2"
                    style={{ background: "#070d18", border: "1px solid #192e48" }}
                  >
                    <div className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: c.available ? "#00ff9d" : "#4a6d8a", boxShadow: c.available ? "0 0 4px #00ff9d60" : "none" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "#e0ecf7" }}>{c.name}</p>
                      <p className="text-[10px]" style={{ color: "#4a6d8a" }}>{c.role}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="text-xs sf-mono shrink-0" style={{ color: "#00c8ff" }}>{c.phone}</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Evacuation routes */}
            <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" style={{ color: "#00ff9d" }} />
                <p className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>Evacuation Routes</p>
              </div>
              <div className="space-y-3">
                {EVACUATION_ROUTES.map((r) => (
                  <div key={r.id} className="rounded-md p-3" style={{ background: "#070d18", border: `1px solid ${r.color}30` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                      <span className="text-xs font-medium" style={{ color: r.color }}>{r.label}</span>
                      <div className="ml-auto flex gap-1">
                        {r.scenario.map((s) => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: "#192e48", color: "#7fa3c2" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <ol className="space-y-1">
                      {r.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px]" style={{ color: "#7fa3c2" }}>
                          <span className="shrink-0 sf-mono" style={{ color: r.color }}>{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Emergency procedures */}
            <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#e0ecf7" }}>Emergency Procedures</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {PROCEDURES.map((p) => (
                  <button key={p.id} onClick={() => setActiveProcedure(activeProcedure === p.id ? null : p.id)}
                    className="flex flex-col items-center gap-2 rounded-lg py-3 transition-all duration-200"
                    style={{
                      background: activeProcedure === p.id ? `${p.color}15` : "#070d18",
                      border: `1px solid ${activeProcedure === p.id ? p.color + "40" : "#192e48"}`,
                      color: activeProcedure === p.id ? p.color : "#7fa3c2",
                    }}
                  >
                    {p.icon}
                    <span className="text-xs font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
              {activeProcedure && (() => {
                const proc = PROCEDURES.find((p) => p.id === activeProcedure)!;
                return (
                  <div className="rounded-md p-4" style={{ background: "#070d18", border: `1px solid ${proc.color}30` }}>
                    <p className="text-sm font-semibold mb-3" style={{ color: proc.color }}>{proc.label} Response Steps</p>
                    <ol className="space-y-2">
                      {proc.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                            style={{ background: `${proc.color}20`, color: proc.color }}>{i + 1}</span>
                          <p className="text-sm" style={{ color: "#7fa3c2" }}>{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })()}
            </div>

            {/* Safety equipment */}
            <div className="rounded-lg p-4" style={{ background: "#0a1220", border: "1px solid #192e48" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "#e0ecf7" }}>Safety Equipment Inventory</p>
              <div className="space-y-4">
                {SAFETY_EQUIPMENT.map((zone) => (
                  <div key={zone.zone}>
                    <p className="text-xs font-medium mb-2" style={{ color: "#7fa3c2" }}>{zone.zone}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {zone.items.map((item) => (
                        <div key={item.type} className="flex items-center gap-2 rounded-md px-3 py-2"
                          style={{ background: "#070d18", border: "1px solid #192e48" }}
                        >
                          {item.status === "ok"
                            ? <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#00ff9d" }} />
                            : <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: "#ffb800" }} />
                          }
                          <div className="min-w-0">
                            <p className="text-xs truncate" style={{ color: "#e0ecf7" }}>{item.type} ×{item.qty}</p>
                            <p className="text-[10px]" style={{ color: item.status === "warning" ? "#ffb800" : "#4a6d8a" }}>{item.expiry}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
