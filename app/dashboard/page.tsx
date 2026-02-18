"use client";

import { DeviceStatusChart } from "@/components/dashboard/device-status-chart";
import { RealtimeOverview } from "@/components/dashboard/realtime-overview";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Box, Cpu } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Smart Factory IoT Monitoring Overview"
      />
      <div className="space-y-6 p-6 sf-fade-in">
        {/* Stats */}
        <StatsCards />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DeviceStatusChart />
          </div>
          <div className="lg:col-span-2">
            <RecentAlerts />
          </div>
        </div>

        {/* Realtime Overview */}
        <RealtimeOverview />

        {/* Quick Links */}
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="border-[#192e48] bg-[#0b1520] text-[#00c8ff] hover:bg-[#142338] hover:text-[#00c8ff] hover:border-[#00c8ff]/30"
          >
            <Link href="/digital-twin">
              <Box className="mr-2 h-4 w-4" />
              Open Digital Twin
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#192e48] bg-[#0b1520] text-[#00ff9d] hover:bg-[#142338] hover:text-[#00ff9d] hover:border-[#00ff9d]/30"
          >
            <Link href="/devices">
              <Cpu className="mr-2 h-4 w-4" />
              Manage Devices
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
