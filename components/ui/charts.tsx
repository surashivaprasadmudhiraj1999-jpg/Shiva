"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Lightweight dependency-free SVG charts. */

export function LineChart({
  data,
  height = 180,
  className,
  color = "hsl(var(--primary))",
  labels,
}: {
  data: number[];
  height?: number;
  className?: string;
  color?: string;
  labels?: string[];
}) {
  const width = 600;
  const pad = 24;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = (width - pad * 2) / (data.length - 1 || 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = height - pad - ((d - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${height - pad} L${points[0][0]},${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} x2={width - pad} y1={pad + g * (height - pad * 2)} y2={pad + g * (height - pad * 2)} stroke="hsl(var(--border))" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#lc-grad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} />
      ))}
      {labels &&
        labels.map((l, i) => (
          <text key={i} x={pad + i * stepX} y={height - 6} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
            {l}
          </text>
        ))}
    </svg>
  );
}

export function BarChart({
  data,
  height = 180,
  className,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  className?: string;
}) {
  const width = 600;
  const pad = 28;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = (width - pad * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-full", className)}>
      {data.map((d, i) => {
        const h = ((d.value / max) * (height - pad * 2)) || 0;
        const x = pad + i * barW + barW * 0.18;
        const y = height - pad - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW * 0.64} height={h} rx="4" fill={d.color ?? "hsl(var(--primary))"} />
            <text x={x + barW * 0.32} y={y - 5} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>
              {d.value}
            </text>
            <text x={x + barW * 0.32} y={height - 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Sparkline({ data, className, color = "hsl(var(--primary))" }: { data: number[]; className?: string; color?: string }) {
  const width = 120;
  const height = 36;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)},${(height - ((d - min) / range) * height).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("h-9 w-full", className)} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DonutChart({
  segments,
  size = 160,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((s, i) => {
          const len = (s.value / total) * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-medium text-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
