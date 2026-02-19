"use client";

import { Header } from "@/components/layout/header";
import {
  factoryData,
  liveSensors,
  mockAlerts,
  type Building,
  type Floor,
  type Machine,
  type Room,
} from "@/components/overview/overview-data";
import { useCallback, useEffect, useState } from "react";
import "./overview.css";

// ============================================================
// State types
// ============================================================
interface NavState {
  level: number;
  maxUnlocked: number;
  building: Building | null;
  floor: Floor | null;
  room: Room | null;
  machine: Machine | null;
}

// ============================================================
// Main Overview Page
// ============================================================
export default function OverviewPage() {
  const [nav, setNav] = useState<NavState>({
    level: 0,
    maxUnlocked: 0,
    building: null,
    floor: null,
    room: null,
    machine: null,
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "machines" | "alerts"
  >("overview");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const goLevel = useCallback((n: number) => {
    setNav((prev) => {
      if (n > prev.maxUnlocked || n === prev.level) return prev;
      return { ...prev, level: n };
    });
  }, []);

  const clickBuilding = useCallback((b: Building) => {
    setNav((prev) => ({
      ...prev,
      level: 1,
      maxUnlocked: Math.max(prev.maxUnlocked, 1),
      building: b,
    }));
  }, []);

  const clickFloor = useCallback((f: Floor) => {
    setNav((prev) => ({
      ...prev,
      level: 2,
      maxUnlocked: Math.max(prev.maxUnlocked, 2),
      floor: f,
    }));
  }, []);

  const clickRoom = useCallback((r: Room) => {
    setNav((prev) => ({
      ...prev,
      level: 3,
      maxUnlocked: Math.max(prev.maxUnlocked, 3),
      room: r,
    }));
  }, []);

  const clickMachine = useCallback((m: Machine) => {
    setNav((prev) => ({
      ...prev,
      level: 4,
      maxUnlocked: Math.max(prev.maxUnlocked, 4),
      machine: m,
    }));
  }, []);

  // Panel context
  const panelName = [
    "Factory Overview",
    nav.building?.name ?? "Building",
    nav.floor?.name ?? "Floor",
    nav.room?.name ?? "Room",
    nav.machine?.name ?? "Machine",
  ][nav.level];

  const panelLoc = [
    `${factoryData.name} · Factory Overview`,
    `${factoryData.name} · ${nav.building?.name ?? ""}`,
    `${nav.building?.name ?? ""} · ${nav.floor?.name ?? ""}`,
    `${nav.building?.name ?? ""} · ${nav.floor?.name ?? ""} · ${nav.room?.name ?? ""}`,
    `${nav.room?.name ?? ""} · ${nav.machine?.id ?? ""}`,
  ][nav.level];

  // Machines for current context
  const currentMachines =
    nav.level >= 3 && nav.room
      ? nav.room.machines
      : nav.level >= 2 && nav.floor
        ? nav.floor.rooms.flatMap((r) => r.machines)
        : nav.level >= 1 && nav.building
          ? nav.building.floors.flatMap((f) =>
              f.rooms.flatMap((r) => r.machines),
            )
          : factoryData.buildings.flatMap((b) =>
              b.floors.flatMap((f) => f.rooms.flatMap((r) => r.machines)),
            );

  const bcItems = [
    { icon: "🏭", label: "Site", text: factoryData.name },
    {
      icon: "🏢",
      label: "Building",
      text: nav.building ? `อาคาร ${nav.building.code}` : "—",
    },
    { icon: "📐", label: "Floor", text: nav.floor?.num ?? "—" },
    { icon: "🚪", label: "Room", text: nav.room?.name ?? "—" },
    { icon: "⚙", label: "Machine", text: nav.machine?.id ?? "—" },
  ];

  const levelBtnLabels = [
    "🏭 Factory",
    "🏢 Building",
    "📐 Floor",
    "🚪 Room",
    "⚙ Machine",
  ];

  return (
    <>
      <Header title="Overview" subtitle="Factory Visualization & Monitoring" />
      <div
        className="ov-theme"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 3.5rem)",
        }}
      >
        {/* Breadcrumb */}
        <div className="ov-breadcrumb">
          {bcItems.map((item, i) => (
            <span key={i} style={{ display: "contents" }}>
              {i > 0 && <span className="ov-bc-arrow">›</span>}
              <div
                className={`ov-bc-item ${i === nav.level ? "ov-bc-active" : i > nav.maxUnlocked ? "ov-bc-unvisited" : ""}`}
                onClick={() => goLevel(i)}
              >
                <span>{item.icon}</span>
                <span className="ov-bc-lv">{item.label}&nbsp;</span>
                <span>{item.text}</span>
              </div>
            </span>
          ))}
        </div>

        {/* Main */}
        <div className="ov-main">
          {/* ═══ VIEWER ═══ */}
          <div className="ov-viewer">
            {/* LV0: Factory Aerial */}
            <div
              className={`ov-level ${nav.level === 0 ? "ov-level-active" : ""}`}
            >
              <div className="ov-grid-bg" />
              <div className="ov-vlabel">
                <div className="ov-vtag">Level 0 — Factory Overview</div>
                <div className="ov-vname">{factoryData.name}</div>
                <div className="ov-vsub">
                  มุมมองจากด้านบน · คลิกอาคารเพื่อ drill down
                </div>
              </div>
              <div className="ov-mt-badge">
                <div className="ov-live-dot" />
                Aerial View · {factoryData.buildings.length} Buildings
              </div>
              <div className="ov-aerial">
                <div className="ov-aerial-bg" />
                <div className="ov-road ov-road-h" style={{ bottom: "30%" }} />
                <div className="ov-road ov-road-v" style={{ left: "31%" }} />
                <div className="ov-road ov-road-v" style={{ right: "25%" }} />
                {factoryData.buildings.map((b) => (
                  <div
                    key={b.id}
                    className="ov-bldg"
                    style={b.style}
                    onClick={() => clickBuilding(b)}
                  >
                    <div className="ov-roof-lines" />
                    <div className="ov-bldg-label">
                      {b.name.split(" — ")[0]}
                    </div>
                    <div className="ov-bldg-sub">{b.subtitle}</div>
                    <div
                      className={`ov-bldg-st ${b.status === "warn" ? "ov-st-warn" : "ov-st-ok"}`}
                    >
                      {b.statusLabel}
                    </div>
                  </div>
                ))}
                <div className="ov-click-hint">
                  👆 คลิกอาคารเพื่อดูรายละเอียด
                </div>
              </div>
            </div>

            {/* LV1: Building / Floors */}
            <div
              className={`ov-level ${nav.level === 1 ? "ov-level-active" : ""}`}
            >
              <div className="ov-grid-bg" style={{ opacity: 0.35 }} />
              <div className="ov-vlabel">
                <div className="ov-vtag">Level 1 — Building</div>
                <div className="ov-vname">{nav.building?.name ?? ""}</div>
                <div className="ov-vsub">เลือกชั้นที่ต้องการ</div>
              </div>
              <div className="ov-mt-badge">
                <div className="ov-live-dot" />
                Building View
              </div>
              {nav.building && (
                <div className="ov-floor-stack">
                  {nav.building.floors.map((f) => (
                    <div
                      key={f.id}
                      className="ov-floor-card"
                      onClick={() => clickFloor(f)}
                    >
                      <div className="ov-floor-num">{f.num}</div>
                      <div className="ov-floor-info">
                        <div className="ov-floor-name">{f.name}</div>
                        <div className="ov-floor-meta">{f.meta}</div>
                        <div className="ov-floor-tags">
                          {f.tags.map((t, ti) => (
                            <span
                              key={ti}
                              className={`ov-ftag ov-ftag-${t.color}`}
                            >
                              {t.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ov-floor-arr">›</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LV2: Floor Plan */}
            <div
              className={`ov-level ${nav.level === 2 ? "ov-level-active" : ""}`}
              style={{ background: "#060c16" }}
            >
              <div className="ov-vlabel">
                <div className="ov-vtag">Level 2 — Floor Plan</div>
                <div className="ov-vname">{nav.floor?.name ?? ""}</div>
                <div className="ov-vsub">คลิกห้องเพื่อเข้า Matterport 3D</div>
              </div>
              <div className="ov-mt-badge">
                <div className="ov-live-dot" />
                Floor Plan · {nav.floor?.rooms.length ?? 0} Rooms
              </div>
              {nav.floor && (
                <div className="ov-fp-scene">
                  <div className="ov-fp-grid" />
                  <div
                    className="ov-corridor"
                    style={{
                      left: "15%",
                      right: "15%",
                      top: "47%",
                      height: "6%",
                    }}
                  />
                  <div
                    className="ov-corridor"
                    style={{
                      left: "48%",
                      top: "12%",
                      bottom: "12%",
                      width: "4%",
                    }}
                  />
                  {nav.floor.rooms.map((r) => (
                    <div
                      key={r.id}
                      className={`ov-room ${r.status === "warn" ? "ov-room-warn" : r.status === "fault" ? "ov-room-fault" : ""}`}
                      style={r.style}
                      onClick={() => clickRoom(r)}
                    >
                      <div
                        className="ov-room-label"
                        style={
                          r.name.length > 14 ? { fontSize: "9px" } : undefined
                        }
                      >
                        {r.name}
                      </div>
                      <div className="ov-room-sub">{r.subtitle}</div>
                      <div
                        className="ov-room-dot"
                        style={{
                          background:
                            r.status === "fault"
                              ? "var(--ov-danger)"
                              : r.status === "warn"
                                ? "var(--ov-warn)"
                                : "var(--ov-online)",
                          boxShadow:
                            r.status === "fault"
                              ? "0 0 6px var(--ov-danger)"
                              : r.status === "warn"
                                ? "0 0 6px var(--ov-warn)"
                                : "0 0 5px var(--ov-online)",
                          ...(r.status === "fault"
                            ? { animation: "ov-blink 1s ease infinite" }
                            : {}),
                        }}
                      />
                    </div>
                  ))}
                  <div className="ov-compass">N↑</div>
                </div>
              )}
            </div>

            {/* LV3: Room 3D */}
            <div
              className={`ov-level ${nav.level === 3 ? "ov-level-active" : ""}`}
              style={{ background: "#050c16" }}
            >
              <div className="ov-vlabel">
                <div className="ov-vtag">Level 3 — 3D Virtual Tour</div>
                <div className="ov-vname">{nav.room?.name ?? ""}</div>
                <div className="ov-vsub">
                  Matterport 3D · คลิกเครื่องเพื่อดูรายละเอียด
                </div>
              </div>
              <div className="ov-mt-badge">
                <div className="ov-live-dot" />
                Matterport Live
              </div>
              <div className="ov-matterport-scene">
                <div className="ov-perspective-room">
                  <div className="ov-wall-back" />
                  <div className="ov-wall-left" />
                  <div className="ov-wall-right" />
                  <div className="ov-floor-3d" />
                  {nav.room?.machines.map((m, i) => {
                    const positions = [
                      { left: "18%", top: "24%", width: "16%", height: "25%" },
                      { left: "40%", top: "21%", width: "16%", height: "25%" },
                      { left: "60%", top: "26%", width: "16%", height: "25%" },
                      { left: "30%", top: "55%", width: "16%", height: "25%" },
                      { left: "52%", top: "55%", width: "16%", height: "25%" },
                    ];
                    const pos = positions[i % positions.length];
                    return (
                      <div
                        key={m.id}
                        className={`ov-machine-3d ${m.status === "fault" ? "ov-m-fault" : m.status === "warning" ? "ov-m-warn" : ""}`}
                        style={pos}
                        onClick={() => clickMachine(m)}
                      >
                        <div className="ov-m3d-icon">{m.icon}</div>
                        <div className="ov-m3d-label">{m.id}</div>
                        <div
                          className="ov-m3d-dot"
                          style={{
                            background:
                              m.status === "fault"
                                ? "var(--ov-danger)"
                                : m.status === "warning"
                                  ? "var(--ov-warn)"
                                  : m.status === "idle"
                                    ? "var(--ov-text-muted)"
                                    : "var(--ov-online)",
                            boxShadow:
                              m.status === "fault"
                                ? "0 0 5px var(--ov-danger)"
                                : m.status === "warning"
                                  ? "0 0 5px var(--ov-warn)"
                                  : m.status === "running"
                                    ? "0 0 5px var(--ov-online)"
                                    : "none",
                          }}
                        />
                      </div>
                    );
                  })}
                  {(!nav.room?.machines || nav.room.machines.length === 0) && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "10px",
                        color: "var(--ov-text-muted)",
                      }}
                    >
                      [ No machines in this room ]
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "9px",
                    color: "var(--ov-text-muted)",
                    textAlign: "center",
                  }}
                >
                  [ Matterport 3D Viewer — เดินในพื้นที่จริงได้ · คลิก Hotspot
                  เพื่อไปยังเครื่อง ]
                </div>
              </div>
              <div className="ov-nav-arrows">
                {["←", "↑", "↓", "→"].map((a) => (
                  <div key={a} className="ov-nav-arr">
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* LV4: Machine Detail */}
            <div
              className={`ov-level ${nav.level === 4 ? "ov-level-active" : ""}`}
              style={{ background: "#050b15" }}
            >
              <div className="ov-vlabel">
                <div className="ov-vtag">Level 4 — Machine Detail</div>
                <div className="ov-vname">{nav.machine?.name ?? ""}</div>
                <div className="ov-vsub">
                  ID: {nav.machine?.id ?? ""} · {nav.room?.name ?? ""} ·{" "}
                  {nav.building?.name ?? ""}
                </div>
              </div>
              <div className="ov-mt-badge">
                <div className="ov-live-dot" />
                Live Sensor Feed
              </div>
              {nav.machine && (
                <div className="ov-machine-detail">
                  <div className="ov-machine-box">
                    <div className="ov-m-big-icon">{nav.machine.icon}</div>
                    <div className="ov-m-id">{nav.machine.id}</div>
                    <div className="ov-m-name">{nav.machine.name}</div>
                    <div
                      className={`ov-m-badge ${
                        nav.machine.status === "warning"
                          ? "ov-m-badge-warn"
                          : nav.machine.status === "fault"
                            ? "ov-m-badge-fault"
                            : nav.machine.status === "idle"
                              ? "ov-m-badge-idle"
                              : ""
                      }`}
                    >
                      {nav.machine.badge}
                    </div>
                  </div>
                  <div className="ov-gauges">
                    {nav.machine.sensors.map((s, i) => (
                      <div key={i} className="ov-gauge">
                        <div className="ov-g-name">{s.name}</div>
                        <div
                          className={`ov-g-val ${s.level === "ok" ? "ov-g-ok" : s.level === "warn" ? "ov-g-warn" : ""}`}
                        >
                          {s.value}
                          <span className="ov-g-unit">{s.unit}</span>
                        </div>
                        <div className="ov-g-bar-wrap">
                          <div
                            className={`ov-g-bar ${s.level === "ok" ? "ov-bar-ok" : s.level === "warn" ? "ov-bar-warn" : "ov-bar-accent"}`}
                            style={{ width: `${s.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Level Buttons */}
            <div className="ov-viewer-btns">
              {levelBtnLabels.map((label, i) => (
                <div
                  key={i}
                  className={`ov-vbtn ${i === nav.level ? "ov-vbtn-cur" : ""}`}
                  onClick={() => goLevel(i)}
                  style={
                    i > nav.maxUnlocked
                      ? { opacity: 0.3, cursor: "default" }
                      : undefined
                  }
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ INFO PANEL ═══ */}
          <div className="ov-panel">
            <div className="ov-panel-head">
              <div className="ov-ph-loc">{panelLoc}</div>
              <div className="ov-ph-name">{panelName}</div>
              <div className="ov-tabs">
                <div
                  className={`ov-tab ${activeTab === "overview" ? "ov-tab-active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </div>
                <div
                  className={`ov-tab ${activeTab === "machines" ? "ov-tab-active" : ""}`}
                  onClick={() => setActiveTab("machines")}
                >
                  Machines
                </div>
                <div
                  className={`ov-tab ${activeTab === "alerts" ? "ov-tab-active" : ""}`}
                  onClick={() => setActiveTab("alerts")}
                >
                  Alerts
                  <span className="ov-tab-badge">
                    {mockAlerts.filter((a) => !a.resolved).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="ov-panel-body">
              {/* Overview Tab */}
              <div
                className={`ov-tab-content ${activeTab === "overview" ? "ov-tab-content-active" : ""}`}
              >
                <div className="ov-stat-row">
                  <div className="ov-stat-box">
                    <div
                      className="ov-stat-n"
                      style={{ color: "var(--ov-accent2)" }}
                    >
                      {factoryData.buildings.length}
                    </div>
                    <div className="ov-stat-l">Buildings</div>
                  </div>
                  <div className="ov-stat-box">
                    <div
                      className="ov-stat-n"
                      style={{ color: "var(--ov-warn)" }}
                    >
                      1
                    </div>
                    <div className="ov-stat-l">Warning</div>
                  </div>
                  <div className="ov-stat-box">
                    <div
                      className="ov-stat-n"
                      style={{ color: "var(--ov-danger)" }}
                    >
                      1
                    </div>
                    <div className="ov-stat-l">Fault</div>
                  </div>
                </div>
                <div className="ov-sec-lbl">Live Sensors</div>
                {liveSensors.map((s, i) => (
                  <div key={i} className={`ov-scard ov-scard-${s.level}`}>
                    <div className="ov-sc-left">
                      <div className="ov-sc-name">{s.name}</div>
                      <div
                        className={`ov-sc-val ${s.level === "warn" ? "ov-sc-val-warn" : s.level === "danger" ? "ov-sc-val-danger" : ""}`}
                      >
                        {s.value}
                        <span className="ov-sc-unit">{s.unit}</span>
                      </div>
                    </div>
                    <svg width="55" height="22" viewBox="0 0 55 22">
                      <polyline
                        points={s.sparkPoints}
                        fill="none"
                        stroke={
                          s.level === "ok"
                            ? "rgba(0,255,157,0.5)"
                            : s.level === "warn"
                              ? "rgba(255,184,0,0.6)"
                              : "rgba(255,69,96,0.6)"
                        }
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Machines Tab */}
              <div
                className={`ov-tab-content ${activeTab === "machines" ? "ov-tab-content-active" : ""}`}
              >
                <div className="ov-sec-lbl">Machines — Current View</div>
                {currentMachines.length === 0 ? (
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      color: "var(--ov-text-muted)",
                      textAlign: "center",
                      padding: "20px 0",
                    }}
                  >
                    No machines in current view
                  </div>
                ) : (
                  currentMachines.map((m) => (
                    <div
                      key={m.id}
                      className="ov-mitem"
                      onClick={() => clickMachine(m)}
                    >
                      <div
                        className={`ov-mi-dot ${
                          m.status === "running"
                            ? "ov-d-online"
                            : m.status === "warning"
                              ? "ov-d-warn"
                              : m.status === "fault"
                                ? "ov-d-fault"
                                : "ov-d-idle"
                        }`}
                      />
                      <div className="ov-mi-info">
                        <div className="ov-mi-name">{m.name}</div>
                        <div className="ov-mi-meta">
                          {m.id} · {m.badge}
                        </div>
                      </div>
                      <span
                        className={`ov-mtag ${
                          m.status === "running"
                            ? "ov-mt-run"
                            : m.status === "fault"
                              ? "ov-mt-fault"
                              : "ov-mt-idle"
                        }`}
                      >
                        {m.status === "running"
                          ? "RUN"
                          : m.status === "fault"
                            ? "FAULT"
                            : m.status === "warning"
                              ? "RUN"
                              : "IDLE"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Alerts Tab */}
              <div
                className={`ov-tab-content ${activeTab === "alerts" ? "ov-tab-content-active" : ""}`}
              >
                <div className="ov-sec-lbl">Active Alerts</div>
                {mockAlerts
                  .filter((a) => !a.resolved)
                  .map((a) => (
                    <div
                      key={a.id}
                      className={`ov-aitem ov-aitem-${a.severity}`}
                    >
                      <div className="ov-ai-icon">{a.icon}</div>
                      <div className="ov-ai-body">
                        <div className="ov-ai-title">{a.title}</div>
                        <div className="ov-ai-meta">{a.meta}</div>
                      </div>
                      <span
                        className={`ov-abadge ${
                          a.severity === "crit"
                            ? "ov-ab-crit"
                            : a.severity === "warn"
                              ? "ov-ab-warn"
                              : "ov-ab-res"
                        }`}
                      >
                        {a.badge}
                      </span>
                    </div>
                  ))}
                <div className="ov-sec-lbl" style={{ marginTop: "4px" }}>
                  Resolved
                </div>
                {mockAlerts
                  .filter((a) => a.resolved)
                  .map((a) => (
                    <div
                      key={a.id}
                      className={`ov-aitem ov-aitem-${a.severity}`}
                      style={{ opacity: 0.55 }}
                    >
                      <div className="ov-ai-icon">{a.icon}</div>
                      <div className="ov-ai-body">
                        <div className="ov-ai-title">{a.title}</div>
                        <div className="ov-ai-meta">{a.meta}</div>
                      </div>
                      <span className="ov-abadge ov-ab-res">OK</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Status Bar */}
            <div className="ov-statusbar">
              <div className="ov-sbi">
                <div className="ov-sd ov-sd-g" />
                IoT Connected
              </div>
              <div className="ov-sbi">
                <div className="ov-sd ov-sd-b" />
                Twin Synced
              </div>
              <div className="ov-sbi">
                <div className="ov-sd ov-sd-y" />2 Alerts
              </div>
              <div className="ov-sbi" style={{ marginLeft: "auto" }}>
                {clock}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
