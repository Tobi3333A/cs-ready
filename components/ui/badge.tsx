import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "brand"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const tones: Record<Tone, string> = {
  brand: "bg-brand-500/12 text-brand-300 ring-brand-500/25",
  accent: "bg-accent-500/12 text-accent-400 ring-accent-500/25",
  neutral: "bg-white/5 text-muted ring-white/10",
  success: "bg-success/12 text-success ring-success/25",
  warning: "bg-warning/12 text-warning ring-warning/25",
  danger: "bg-danger/12 text-danger ring-danger/25",
  info: "bg-info/12 text-info ring-info/25",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
