"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ReadinessGenerateContextValue = {
  loading: boolean;
  error: string | null;
  generate: () => Promise<void>;
};

const ReadinessGenerateContext =
  createContext<ReadinessGenerateContextValue | null>(null);

export function useReadinessGenerate() {
  return useContext(ReadinessGenerateContext);
}

export function ReadinessGenerateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  const generate = useCallback(async () => {
    if (loading || isRefreshing) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/readiness", { method: "POST" });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!res.ok || data?.error || !data?.success) {
        throw new Error(data?.error ?? "Failed to generate readiness score");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to generate readiness score"
      );
    } finally {
      setLoading(false);
    }
  }, [loading, isRefreshing, router]);

  const value = useMemo(
    () => ({ loading: loading || isRefreshing, error, generate }),
    [loading, isRefreshing, error, generate]
  );

  return (
    <ReadinessGenerateContext.Provider value={value}>
      {children}
    </ReadinessGenerateContext.Provider>
  );
}

const GENERATING_STAGES = [
  {
    label: "Reading your profile & target roles",
    detail: "Pulling grade, skills, and the roles you're aiming for.",
  },
  {
    label: "Researching your connected profiles",
    detail: "Inspecting GitHub, LeetCode, LinkedIn, and portfolio links.",
  },
  {
    label: "Scoring DSA & problem-solving signals",
    detail: "Looking at difficulty mix, patterns, and consistency.",
  },
  {
    label: "Evaluating projects, GitHub & system design",
    detail: "Judging repo quality, demos, READMEs, and architecture depth.",
  },
  {
    label: "Assessing resume & behavioral readiness",
    detail: "Checking experience signals, impact, and communication evidence.",
  },
  {
    label: "Computing overall score & role fit",
    detail: "Weighting categories for your targets and writing your insight.",
  },
] as const;

const CATEGORY_SKELETONS = [
  { label: "Data Structures & Algorithms", icon: "🧠" },
  { label: "Projects & Portfolio", icon: "🚀" },
  { label: "Open Source & GitHub", icon: "🐙" },
  { label: "System Design", icon: "🏗️" },
  { label: "Resume & Experience", icon: "📄" },
  { label: "Behavioral & Comms", icon: "💬" },
] as const;

export function ReadinessGeneratingPanel({
  error,
  onRetry,
}: {
  error?: string | null;
  onRetry?: () => void;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (error) return;

    const stageTimer = window.setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, GENERATING_STAGES.length - 1));
    }, 4200);

    const progressTimer = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        const remaining = 92 - p;
        return p + Math.max(0.6, remaining * 0.045);
      });
    }, 400);

    return () => {
      window.clearInterval(stageTimer);
      window.clearInterval(progressTimer);
    };
  }, [error]);

  const activeStage = GENERATING_STAGES[stageIndex];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-5 animate-in lg:p-8">
      <Card className="overflow-hidden border-brand-500/25 bg-gradient-to-br from-brand-600/20 via-surface to-surface">
        <CardBody className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/20 text-xl">
              <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-500/20 [animation-duration:2s]" />
              <span className="relative">🧭</span>
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium text-brand-300">
                {error ? "Analysis paused" : "Analyzing your readiness"}
              </p>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                {error
                  ? "We hit a snag while scoring your profile"
                  : activeStage.label}
              </h2>
              <p className="text-sm text-muted">{error ?? activeStage.detail}</p>
            </div>
          </div>

          {!error && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-subtle">
                <span>
                  Step {stageIndex + 1} of {GENERATING_STAGES.length}
                </span>
                <span className="tabular-nums">{Math.round(progress)}%</span>
              </div>
              <Progress
                value={progress}
                tone="from-brand-400 to-accent-400"
                className="[&>div]:h-2.5"
              />
            </div>
          )}

          {error && onRetry && (
            <Button onClick={onRetry} className="cursor-pointer">
              Try again
            </Button>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_SKELETONS.map((category, i) => {
          const revealed = !error && i <= Math.min(stageIndex, CATEGORY_SKELETONS.length - 1);
          const active = !error && i === Math.min(stageIndex, CATEGORY_SKELETONS.length - 1);

          return (
            <Card
              key={category.label}
              className={cn(
                "p-4 transition-all duration-500",
                !revealed && "opacity-35",
                active && "border-brand-500/40 bg-brand-500/5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-lg">
                    {category.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {category.label}
                    </p>
                    <p className="text-xs text-subtle">
                      {revealed ? (active ? "Scoring…" : "Queued") : "Waiting"}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-lg font-bold tabular-nums",
                    active ? "animate-pulse text-brand-300" : "text-subtle"
                  )}
                >
                  —
                </span>
              </div>
              <div
                className={cn(
                  "mt-3 h-2 overflow-hidden rounded-full bg-white/8",
                  active && "animate-pulse"
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r from-brand-400/50 to-accent-400/40 transition-all duration-700",
                    revealed ? (active ? "w-2/3" : "w-1/3") : "w-0"
                  )}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        {GENERATING_STAGES.map((stage, i) => {
          const done = !error && i < stageIndex;
          const active = !error && i === stageIndex;

          return (
            <div
              key={stage.label}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-border/60 bg-surface-2/30 px-4 py-3 transition-opacity duration-500",
                !done && !active && "opacity-40"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                  done && "bg-accent-500/20 text-accent-400",
                  active && "bg-brand-500/25 text-brand-300",
                  !done && !active && "bg-white/8 text-subtle"
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{stage.label}</p>
                <p className="text-xs text-muted">{stage.detail}</p>
              </div>
              {active && (
                <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-brand-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                  Live
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!error && (
        <p className="text-center text-xs text-subtle">
          This usually takes a bit — we research your profiles before scoring.
        </p>
      )}
    </div>
  );
}
