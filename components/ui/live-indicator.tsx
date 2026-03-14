"use client";

import { useMqttStatus } from "@/lib/websocket/use-mqtt";

/**
 * Compact MQTT connection status indicator.
 * Shows a pulsing green dot + "LIVE" when connected,
 * blinking yellow + "CONNECTING..." when in progress,
 * or gray + "OFFLINE" when disconnected.
 */
export function LiveIndicator() {
  const { connected, connecting } = useMqttStatus();

  if (connected) {
    return (
      <div
        className="hidden sm:flex items-center gap-1.5 rounded px-2 py-0.5"
        style={{
          background: "rgba(0,255,157,0.1)",
          border: "1px solid rgba(0,255,157,0.3)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full sf-pulse-dot"
          style={{
            background: "#00ff9d",
            boxShadow: "0 0 4px rgba(0,255,157,0.6)",
          }}
        />
        <span
          className="text-[10px] font-bold sf-mono"
          style={{ color: "#00ff9d" }}
        >
          LIVE
        </span>
      </div>
    );
  }

  if (connecting) {
    return (
      <div
        className="hidden sm:flex items-center gap-1.5 rounded px-2 py-0.5"
        style={{
          background: "rgba(255,200,0,0.1)",
          border: "1px solid rgba(255,200,0,0.3)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{
            background: "#ffc800",
            boxShadow: "0 0 4px rgba(255,200,0,0.6)",
          }}
        />
        <span
          className="text-[10px] font-bold sf-mono"
          style={{ color: "#ffc800" }}
        >
          CONNECTING...
        </span>
      </div>
    );
  }

  // Disconnected / offline
  return (
    <div
      className="hidden sm:flex items-center gap-1.5 rounded px-2 py-0.5"
      style={{
        background: "rgba(100,100,120,0.1)",
        border: "1px solid rgba(100,100,120,0.3)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "#5a6a7a" }}
      />
      <span
        className="text-[10px] font-bold sf-mono"
        style={{ color: "#5a6a7a" }}
      >
        OFFLINE
      </span>
    </div>
  );
}
