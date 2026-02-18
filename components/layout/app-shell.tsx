"use client";

import { startSimulation, stopSimulation } from "@/lib/mock-realtime";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Start real-time simulation on mount
  useEffect(() => {
    startSimulation(3000);
    return () => stopSimulation();
  }, []);

  return (
    <div className="min-h-screen sf-grid-bg" style={{ background: "#070d18" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-60"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
