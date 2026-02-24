"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Factory,
  LayoutDashboard,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Digital Twin", href: "/digital-twin", icon: Box },
  { label: "Devices", href: "/devices", icon: Cpu },
];

interface SidebarProps {
  /** Desktop: icon-only collapsed state */
  collapsed: boolean;
  onToggle: () => void;
  /** Mobile: drawer open state */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Logo */}
      <div
        className="flex h-14 items-center px-3 overflow-hidden shrink-0"
        style={{ borderBottom: "1px solid #192e48" }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 min-w-0"
          onClick={mobile ? onMobileClose : undefined}
        >
          <Factory
            className="h-7 w-7 shrink-0"
            style={{
              color: "#00c8ff",
              filter: "drop-shadow(0 0 6px rgba(0,200,255,0.5))",
            }}
          />
          <span
            className={cn(
              "text-lg font-bold whitespace-nowrap tracking-wide transition-all duration-300 overflow-hidden",
              !mobile && collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
            style={{
              background: "linear-gradient(135deg, #00c8ff, #00ff9d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            SMART FACTORY
          </span>
        </Link>
        {/* Mobile close button */}
        {mobile && (
          <button
            onClick={onMobileClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#142338]"
            style={{ color: "#7fa3c2" }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 p-2 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          const linkContent = (
            <Link
              href={item.href}
              onClick={mobile ? onMobileClose : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                !mobile && collapsed ? "justify-center px-0" : "",
                isActive ? "" : "hover:bg-[#142338]",
              )}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, rgba(0,200,255,0.15) 0%, rgba(0,200,255,0.05) 100%)",
                      color: "#00c8ff",
                      borderLeft:
                        !mobile && collapsed ? "none" : "2px solid #00c8ff",
                      boxShadow: "inset 0 0 20px rgba(0,200,255,0.05)",
                    }
                  : { color: "#7fa3c2" }
              }
            >
              <item.icon
                className="h-5 w-5 shrink-0"
                style={
                  isActive
                    ? { filter: "drop-shadow(0 0 4px rgba(0,200,255,0.5))" }
                    : undefined
                }
              />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300 overflow-hidden",
                  !mobile && collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                )}
              >
                {item.label}
              </span>
            </Link>
          );

          if (!mobile && collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="border-[#192e48] bg-[#0f1d2e] text-[#e0ecf7]"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* System Status */}
      <div
        className={cn(
          "mx-2 mb-2 rounded-md p-3 transition-all duration-300 overflow-hidden shrink-0",
          !mobile && collapsed ? "opacity-0 h-0 p-0 mx-0 mb-0" : "opacity-100",
        )}
        style={{ background: "#0b1520", border: "1px solid #192e48" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0 sf-pulse-dot"
            style={{
              background: "#00ff9d",
              boxShadow: "0 0 6px rgba(0,255,157,0.5)",
            }}
          />
          <span className="text-xs font-medium" style={{ color: "#00ff9d" }}>
            SYSTEM ONLINE
          </span>
        </div>
        <span className="text-[10px] sf-mono" style={{ color: "#4a6d8a" }}>
          All services operational
        </span>
      </div>

      {/* Collapse Toggle — desktop only */}
      {!mobile && (
        <div
          className="flex items-center justify-center p-2 shrink-0"
          style={{ borderTop: "1px solid #192e48" }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggle}
                className="flex h-8 w-full items-center justify-center rounded-md transition-all duration-200 hover:bg-[#142338] group"
                style={{ color: "#4a6d8a" }}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4 transition-colors duration-200 group-hover:text-[#00c8ff]" />
                ) : (
                  <div className="flex items-center gap-2 w-full px-2">
                    <ChevronLeft className="h-4 w-4 shrink-0 transition-colors duration-200 group-hover:text-[#00c8ff]" />
                    <span className="text-xs transition-colors duration-200 group-hover:text-[#00c8ff]">
                      Collapse
                    </span>
                  </div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="border-[#192e48] bg-[#0f1d2e] text-[#e0ecf7]"
            >
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-60",
        )}
        style={{
          background: "linear-gradient(180deg, #060b14 0%, #0a1220 100%)",
          borderRight: "1px solid #192e48",
        }}
      >
        <NavContent />
      </aside>

      {/* Floating toggle tab — desktop only */}
      <button
        onClick={onToggle}
        className="hidden md:flex fixed z-50 items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          left: collapsed ? "52px" : "228px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "20px",
          height: "48px",
          background: "linear-gradient(135deg, #0f1d2e, #142338)",
          border: "1px solid #1e3c60",
          borderRadius: "0 6px 6px 0",
          color: "#4a6d8a",
          cursor: "pointer",
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" style={{ color: "#7fa3c2" }} />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" style={{ color: "#7fa3c2" }} />
        )}
      </button>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onMobileClose}
      />
      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          background: "linear-gradient(180deg, #060b14 0%, #0a1220 100%)",
          borderRight: "1px solid #192e48",
        }}
      >
        <NavContent mobile />
      </aside>
    </TooltipProvider>
  );
}
