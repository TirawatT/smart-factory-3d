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
  const { percentage, color, glowColor, arcPath, needlePath } = useMemo(() => {
    const range = max - min;
    const pct = Math.max(0, Math.min(1, (value - min) / range));

    let clr = "#00ff9d"; // green
    let glow = "rgba(0,255,157,0.4)";
    if (value >= thresholdCritical) {
      clr = "#ff4560";
      glow = "rgba(255,69,96,0.4)";
    } else if (value >= thresholdWarning) {
      clr = "#ffb800";
      glow = "rgba(255,184,0,0.4)";
    }

    const cx = size / 2;
    const cy = size / 2 + 5;
    const r = size / 2 - 12;
    const startAngle = Math.PI;
    const endAngle = 0;
    const currentAngle = Math.PI - pct * Math.PI;

    const arcX1 = cx + r * Math.cos(startAngle);
    const arcY1 = cy + r * Math.sin(startAngle);
    const arcX2 = cx + r * Math.cos(endAngle);
    const arcY2 = cy + r * Math.sin(endAngle);
    const arc = `M ${arcX1} ${arcY1} A ${r} ${r} 0 0 1 ${arcX2} ${arcY2}`;

    const needleLen = r - 8;
    const nx = cx + needleLen * Math.cos(currentAngle);
    const ny = cy + needleLen * Math.sin(currentAngle);
    const needle = `M ${cx} ${cy} L ${nx} ${ny}`;

    return {
      percentage: pct,
      color: clr,
      glowColor: glow,
      arcPath: arc,
      needlePath: needle,
    };
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
          stroke="#192e48"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Value arc (colored with glow) */}
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${percentage * Math.PI * (size / 2 - 12)} ${Math.PI * (size / 2 - 12)}`}
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
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
        <circle
          cx={size / 2}
          cy={size / 2 + 5}
          r={4}
          fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
        />
        {/* Value text */}
        <text
          x={size / 2}
          y={size / 2 + 2}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.14}
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="bold"
        >
          {value.toFixed(1)}
        </text>
        {/* Unit text */}
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          fill="#4a6d8a"
          fontSize={size * 0.09}
          fontFamily="'IBM Plex Mono', monospace"
        >
          {unit}
        </text>
      </svg>
      {label && (
        <span className="mt-1 text-xs" style={{ color: "#7fa3c2" }}>
          {label}
        </span>
      )}
    </div>
  );
}
