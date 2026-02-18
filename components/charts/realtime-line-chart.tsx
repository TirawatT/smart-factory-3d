"use client";

import { SensorReading } from "@/lib/types";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RealtimeLineChartProps {
  readings: SensorReading[];
  unit?: string;
  color?: string;
  thresholdWarning?: number;
  thresholdCritical?: number;
  height?: number;
  showGrid?: boolean;
  compact?: boolean;
}

export function RealtimeLineChart({
  readings,
  unit = "",
  color = "#00c8ff",
  thresholdWarning,
  thresholdCritical,
  height = 200,
  showGrid = true,
  compact = false,
}: RealtimeLineChartProps) {
  const data = readings.map((r) => ({
    time: r.timestamp,
    value: r.value,
  }));

  const formatTime = (ts: number) => format(new Date(ts), "HH:mm:ss");

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="rounded-md px-3 py-2 text-xs shadow-lg"
        style={{
          background: "#0f1d2e",
          border: "1px solid #192e48",
          color: "#e0ecf7",
        }}
      >
        <p style={{ color: "#4a6d8a" }} className="sf-mono">
          {format(new Date(payload[0].payload.time), "HH:mm:ss")}
        </p>
        <p className="font-semibold sf-mono" style={{ color }}>
          {payload[0].value} {unit}
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={
          compact
            ? { top: 5, right: 5, bottom: 5, left: 5 }
            : { top: 5, right: 20, bottom: 5, left: 10 }
        }
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#192e48" opacity={0.5} />
        )}
        <XAxis
          dataKey="time"
          tickFormatter={formatTime}
          tick={{ fontSize: compact ? 9 : 11, fill: "#4a6d8a" }}
          interval="preserveStartEnd"
          minTickGap={40}
          stroke="#192e48"
        />
        {!compact && (
          <YAxis
            tick={{ fontSize: 11, fill: "#4a6d8a" }}
            width={45}
            tickFormatter={(v: number) => v.toFixed(1)}
            stroke="#192e48"
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        {thresholdWarning !== undefined && (
          <ReferenceLine
            y={thresholdWarning}
            stroke="#ffb800"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={
              compact
                ? undefined
                : { value: "Warning", fontSize: 10, fill: "#ffb800" }
            }
          />
        )}
        {thresholdCritical !== undefined && (
          <ReferenceLine
            y={thresholdCritical}
            stroke="#ff4560"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={
              compact
                ? undefined
                : { value: "Critical", fontSize: 10, fill: "#ff4560" }
            }
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
