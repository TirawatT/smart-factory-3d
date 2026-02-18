"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimeStore } from "@/stores/realtime-store";
import { Bell, Radio, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const alerts = useRealtimeStore((s) => s.alerts);
  const unackCount = alerts.filter((a) => !a.acknowledged).length;
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="flex h-14 items-center justify-between px-6"
      style={{
        background: "linear-gradient(90deg, #0b1520 0%, #0f1d2e 100%)",
        borderBottom: "1px solid #192e48",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-6 w-1 rounded-full"
          style={{ background: "linear-gradient(180deg, #00c8ff, #00ff9d)" }}
        />
        <div>
          <h1
            className="text-base font-semibold tracking-wide"
            style={{ color: "#e0ecf7" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px]" style={{ color: "#4a6d8a" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div
          className="flex items-center gap-2 rounded-md px-3 py-1.5"
          style={{
            background: "rgba(0,255,157,0.06)",
            border: "1px solid rgba(0,255,157,0.15)",
          }}
        >
          <Radio
            className="h-3.5 w-3.5 sf-pulse-dot"
            style={{ color: "#00ff9d" }}
          />
          <span
            className="text-xs font-medium sf-mono"
            style={{ color: "#00ff9d" }}
          >
            LIVE
          </span>
        </div>

        {/* Clock */}
        <div
          className="flex items-center gap-1.5 text-xs sf-mono"
          style={{ color: "#7fa3c2" }}
        >
          <Zap className="h-3.5 w-3.5" style={{ color: "#00c8ff" }} />
          <span>{time}</span>
        </div>

        {/* Alerts indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 hover:bg-[#142338]"
        >
          <Bell className="h-5 w-5" style={{ color: "#7fa3c2" }} />
          {unackCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] border-0"
              style={{
                background: "#ff4560",
                color: "#fff",
                boxShadow: "0 0 8px rgba(255,69,96,0.4)",
              }}
            >
              {unackCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
