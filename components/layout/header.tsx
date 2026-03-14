"use client";

import { useMobileMenu } from "@/components/layout/app-shell";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { openMobileMenu } = useMobileMenu();
  const { data: alerts = [] } = useAlerts({ status: "active" });
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length;

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now
    ? now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const dateStr = now
    ? now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4"
      style={{
        background: "rgba(7,13,24,0.90)",
        borderBottom: "1px solid #192e48",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Hamburger (mobile only) */}
      <button
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-md hover:bg-[#142338] shrink-0"
        style={{ color: "#7fa3c2" }}
        onClick={openMobileMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-base sm:text-lg font-bold leading-tight truncate"
          style={{
            color: "#e0ecf7",
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-[10px] sm:text-xs truncate"
            style={{
              color: "#4a6d8a",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* LIVE badge */}
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

        {/* Clock */}
        <div className="hidden sm:flex flex-col items-end">
          <span
            className="text-xs font-bold sf-mono"
            style={{ color: "#00c8ff" }}
          >
            {timeStr}
          </span>
          <span className="text-[9px] sf-mono" style={{ color: "#4a6d8a" }}>
            {dateStr}
          </span>
        </div>

        {/* Bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:bg-[#142338]"
          style={{ color: "#7fa3c2" }}
          aria-label="Alerts"
        >
          <Bell className="h-4.5 w-4.5" />
          {activeAlerts > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[9px] font-bold sf-mono"
              style={{
                background: "#ff4560",
                color: "#fff",
                boxShadow: "0 0 6px rgba(255,69,96,0.5)",
              }}
            >
              {activeAlerts > 9 ? "9+" : activeAlerts}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
