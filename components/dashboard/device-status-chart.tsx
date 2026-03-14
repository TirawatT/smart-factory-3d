"use client";

import { useDevices } from "@/lib/hooks/use-devices";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS: Record<string, string> = {
  online: "#00ff9d",
  offline: "#4a6d8a",
  warning: "#ffb800",
  critical: "#ff4560",
};

export function DeviceStatusChart() {
  const { data: devices = [] } = useDevices();

  const statusCounts = devices.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: COLORS[status] || "#4a6d8a",
  }));

  return (
    <div className="rounded-lg p-4 sf-card">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-4 w-1 rounded-full"
          style={{ background: "linear-gradient(180deg, #00c8ff, #00ff9d)" }}
        />
        <h3 className="text-sm font-semibold" style={{ color: "#e0ecf7" }}>
          Device Status
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0f1d2e",
              border: "1px solid #192e48",
              borderRadius: "6px",
              color: "#e0ecf7",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span style={{ color: "#7fa3c2", fontSize: "11px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
