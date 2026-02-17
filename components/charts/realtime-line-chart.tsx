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
  color = "hsl(var(--primary))",
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
      <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
        <p className="text-muted-foreground">
          {format(new Date(payload[0].payload.time), "HH:mm:ss")}
        </p>
        <p className="font-semibold">
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
        {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
        <XAxis
          dataKey="time"
          tickFormatter={formatTime}
          tick={{ fontSize: compact ? 9 : 11 }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        {!compact && (
          <YAxis
            tick={{ fontSize: 11 }}
            width={45}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        {thresholdWarning !== undefined && (
          <ReferenceLine
            y={thresholdWarning}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={compact ? undefined : { value: "Warning", fontSize: 10 }}
          />
        )}
        {thresholdCritical !== undefined && (
          <ReferenceLine
            y={thresholdCritical}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={compact ? undefined : { value: "Critical", fontSize: 10 }}
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
