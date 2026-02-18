"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Box,
  Building2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Factory,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/overview", icon: Building2 },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Digital Twin", href: "/digital-twin", icon: Box },
  { label: "Devices", href: "/devices", icon: Cpu },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-60",
        )}
        style={{
          background: "linear-gradient(180deg, #060b14 0%, #0a1220 100%)",
          borderRight: "1px solid #192e48",
        }}
      >
        {/* Logo */}
        <div
          className="flex h-14 items-center px-3"
          style={{ borderBottom: "1px solid #192e48" }}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <Factory
                className="h-7 w-7 shrink-0"
                style={{
                  color: "#00c8ff",
                  filter: "drop-shadow(0 0 6px rgba(0,200,255,0.5))",
                }}
              />
            </div>
            {!collapsed && (
              <span
                className="text-lg font-bold whitespace-nowrap tracking-wide"
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
            )}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 p-2 mt-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive ? "" : "hover:bg-[#142338]",
                )}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(90deg, rgba(0,200,255,0.15) 0%, rgba(0,200,255,0.05) 100%)",
                        color: "#00c8ff",
                        borderLeft: "2px solid #00c8ff",
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
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>

        {/* System Status Indicator */}
        {!collapsed && (
          <div
            className="mx-3 mb-2 rounded-md p-3"
            style={{ background: "#0b1520", border: "1px solid #192e48" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block h-2 w-2 rounded-full sf-pulse-dot"
                style={{
                  background: "#00ff9d",
                  boxShadow: "0 0 6px rgba(0,255,157,0.5)",
                }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "#00ff9d" }}
              >
                SYSTEM ONLINE
              </span>
            </div>
            <span className="text-[10px] sf-mono" style={{ color: "#4a6d8a" }}>
              All services operational
            </span>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="p-2" style={{ borderTop: "1px solid #192e48" }}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-[#7fa3c2] hover:text-[#00c8ff] hover:bg-[#142338]"
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
