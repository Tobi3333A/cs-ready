import { clamp, cn } from "@/lib/utils";

function toneForScore(score: number): string {
  if (score >= 85) return "from-accent-400 to-accent-500";
  if (score >= 65) return "from-info to-brand-400";
  if (score >= 40) return "from-warning to-brand-400";
  return "from-danger to-warning";
}

export function Progress({
  value,
  className,
  showValue = false,
  tone,
}: {
  value: number;
  className?: string;
  showValue?: boolean;
  tone?: string;
}) {
  const pct = clamp(value);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700",
            tone ?? toneForScore(pct)
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <span className="w-9 text-right text-sm font-semibold tabular-nums text-foreground">
          {Math.round(pct)}
        </span>
      )}
    </div>
  );
}
