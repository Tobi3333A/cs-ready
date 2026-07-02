import type { ReactNode } from "react";
import { clamp, cn } from "@/lib/utils";

function strokeForScore(score: number): string {
  if (score >= 85) return "#34d399";
  if (score >= 65) return "#38bdf8";
  if (score >= 40) return "#f59e0b";
  return "#f43f5e";
}

/**
 * Circular progress gauge used for readiness scores.
 * Pure SVG — no client JS required.
 */
export function ScoreRing({
  value,
  size = 176,
  strokeWidth = 12,
  label,
  sublabel,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: ReactNode;
  sublabel?: ReactNode;
  className?: string;
}) {
  const pct = clamp(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = strokeForScore(pct);

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
            filter: `drop-shadow(0 0 6px ${color}55)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-4xl font-bold tabular-nums text-foreground">
            {Math.round(pct)}
            <span className="text-lg text-subtle">/100</span>
          </div>
          {label && (
            <div className="mt-1 text-sm font-medium" style={{ color }}>
              {label}
            </div>
          )}
          {sublabel && <div className="text-xs text-subtle">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
