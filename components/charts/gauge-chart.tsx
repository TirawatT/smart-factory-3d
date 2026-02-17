"use client";

import { useMemo } from "react";

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  thresholdWarning: number;
  thresholdCritical: number;
  unit: string;
  label?: string;
  size?: number;
}

export function GaugeChart({
  value,
  min,
  max,
  thresholdWarning,
  thresholdCritical,
  unit,
  label,
  size = 120,
}: GaugeChartProps) {
  const { percentage, color, arcPath, needlePath } = useMemo(() => {
    const range = max - min;
    const pct = Math.max(0, Math.min(1, (value - min) / range));

    // color based on thresholds
    let clr = "#10b981"; // green
    if (value >= thresholdCritical)
      clr = "#ef4444"; // red
    else if (value >= thresholdWarning) clr = "#f59e0b"; // yellow

    // Arc calculation (180 degree gauge, bottom-centered)
    const cx = size / 2;
    const cy = size / 2 + 5;
    const r = size / 2 - 12;
    const startAngle = Math.PI;
    const endAngle = 0;
    const currentAngle = Math.PI - pct * Math.PI;

    // Background arc
    const arcX1 = cx + r * Math.cos(startAngle);
    const arcY1 = cy + r * Math.sin(startAngle);
    const arcX2 = cx + r * Math.cos(endAngle);
    const arcY2 = cy + r * Math.sin(endAngle);
    const arc = `M ${arcX1} ${arcY1} A ${r} ${r} 0 0 1 ${arcX2} ${arcY2}`;

    // Needle
    const needleLen = r - 8;
    const nx = cx + needleLen * Math.cos(currentAngle);
    const ny = cy + needleLen * Math.sin(currentAngle);
    const needle = `M ${cx} ${cy} L ${nx} ${ny}`;

    return { percentage: pct, color: clr, arcPath: arc, needlePath: needle };
  }, [value, min, max, thresholdWarning, thresholdCritical, size]);

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 25}`}
      >
        {/* Background arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Value arc (colored) */}
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${percentage * Math.PI * (size / 2 - 12)} ${Math.PI * (size / 2 - 12)}`}
        />
        {/* Needle */}
        <path
          d={needlePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx={size / 2} cy={size / 2 + 5} r={4} fill={color} />
        {/* Value text */}
        <text
          x={size / 2}
          y={size / 2 + 2}
          textAnchor="middle"
          className="fill-foreground text-lg font-bold"
          fontSize={size * 0.14}
        >
          {value.toFixed(1)}
        </text>
        {/* Unit text */}
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={size * 0.09}
        >
          {unit}
        </text>
      </svg>
      {label && (
        <span className="mt-1 text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
