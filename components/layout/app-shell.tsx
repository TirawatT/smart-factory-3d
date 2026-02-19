"use client";

import { startSimulation, stopSimulation } from "@/lib/mock-realtime";
import { cn } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

// ── Mobile menu context ──────────────────────────────────────────────────────
// Pages render <Header> inside themselves. The Header needs to call
// openMobileMenu(), which lives in AppShell. We bridge them via context.
interface MobileMenuCtx {
  openMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuCtx>({
  openMobileMenu: () => {},
});

/** Call inside Header (or any child) to open the mobile sidebar drawer. */
export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
// ─────────────────────────────────────────────────────────────────────────────

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Desktop: icon-only collapsed state (persisted in localStorage)
  const [collapsed, setCollapsed] = useState(false);
  // Mobile: drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sf-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const handleToggle = () => {
    setCollapsed((v) => {
      localStorage.setItem("sf-sidebar-collapsed", String(!v));
      return !v;
    });
  };

  // Start realtime mock simulation
  useEffect(() => {
    startSimulation(3000);
    return () => stopSimulation();
  }, []);

  return (
    <MobileMenuContext.Provider
      value={{ openMobileMenu: () => setMobileOpen(true) }}
    >
      <div
        className="min-h-screen sf-grid-bg"
        style={{ background: "#070d18" }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/*
          Main content area.
          - Mobile (default): no left margin — sidebar is a full-screen overlay.
          - Desktop md+: left margin matches sidebar width.
          We write out the full Tailwind class names so the purger picks them up.
        */}
        <main
          className={cn(
            "transition-all duration-300 min-h-screen",
            // desktop margin — full class names so Tailwind includes them
            collapsed ? "md:ml-16" : "md:ml-60",
          )}
        >
          {children}
        </main>
      </div>
    </MobileMenuContext.Provider>
  );
}
