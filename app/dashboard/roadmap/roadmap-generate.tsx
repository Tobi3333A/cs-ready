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

type RoadmapGenerateContextValue = {
  loading: boolean;
  error: string | null;
  generate: () => Promise<void>;
};

const RoadmapGenerateContext = createContext<RoadmapGenerateContextValue | null>(
  null
);

export function useRoadmapGenerate() {
  return useContext(RoadmapGenerateContext);
}

export function RoadmapGenerateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  const generate = useCallback(async () => {
    if (loading || isRefreshing) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/roadmap", { method: "POST" });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!res.ok || data?.error || !data?.success) {
        throw new Error(data?.error ?? "Failed to generate roadmap");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  }, [loading, isRefreshing, router]);

  const value = useMemo(
    () => ({ loading: loading || isRefreshing, error, generate }),
    [loading, isRefreshing, error, generate]
  );

  return (
    <RoadmapGenerateContext.Provider value={value}>
      {children}
    </RoadmapGenerateContext.Provider>
  );
}

const GENERATING_STAGES = [
  {
    label: "Reading your profile & readiness scores",
    detail: "Pulling grade, target roles, and category breakdown.",
  },
  {
    label: "Researching your connected profiles",
    detail: "Inspecting GitHub, LeetCode, LinkedIn, and portfolio links.",
  },
  {
    label: "Prioritizing your weakest categories",
    detail: "Ranking gaps so early weeks close the biggest deficits first.",
  },
  {
    label: "Drafting your 6-week arc",
    detail: "Foundations → skill building → portfolio polish → interview prep.",
  },
  {
    label: "Writing concrete weekly tasks",
    detail: "Turning each phase into 3–5 specific, completable actions.",
  },
  {
    label: "Finalizing your personalized plan",
    detail: "Locking timeline labels, scores, and motivating target.",
  },
] as const;

export function RoadmapGeneratingPanel({
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
    <div className="mx-auto w-full max-w-4xl space-y-6 p-5 animate-in lg:p-8">
      <Card className="overflow-hidden border-brand-500/25 bg-gradient-to-br from-brand-600/20 via-surface to-surface">
        <CardBody className="space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/20 text-xl">
              <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-500/20 [animation-duration:2s]" />
              <span className="relative">🗺️</span>
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium text-brand-300">
                {error ? "Generation paused" : "Building your roadmap"}
              </p>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                {error
                  ? "We hit a snag while personalizing your plan"
                  : activeStage.label}
              </h2>
              <p className="text-sm text-muted">
                {error ?? activeStage.detail}
              </p>
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

      <div className="relative space-y-4 pl-6">
        <div className="absolute bottom-4 left-[7px] top-4 w-px bg-border" />

        {GENERATING_STAGES.map((stage, i) => {
          const done = !error && i < stageIndex;
          const active = !error && i === stageIndex;

          return (
            <div
              key={stage.label}
              className={cn(
                "relative transition-opacity duration-500",
                !done && !active && "opacity-40"
              )}
            >
              <span
                className={cn(
                  "absolute -left-6 top-6 h-3.5 w-3.5 rounded-full ring-4 ring-canvas transition-colors",
                  done && "bg-accent-500",
                  active && "bg-brand-400 shadow-[0_0_12px_rgba(129,140,248,0.55)]",
                  !done && !active && "bg-white/20"
                )}
              />
              <Card
                className={cn(
                  "p-5",
                  active && "border-brand-500/40 bg-brand-500/5"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-subtle">
                    Phase {i + 1}
                  </span>
                  {done && (
                    <span className="text-xs font-medium text-accent-400">Done</span>
                  )}
                  {active && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-brand-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                      In progress
                    </span>
                  )}
                </div>
                <p className="mt-2 font-medium text-foreground">{stage.label}</p>
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "h-2.5 rounded-full bg-white/6",
                      active && "animate-pulse bg-brand-400/20"
                    )}
                    style={{ width: active ? "78%" : done ? "100%" : "55%" }}
                  />
                  <div
                    className={cn(
                      "h-2.5 rounded-full bg-white/6",
                      active && "animate-pulse bg-brand-400/15"
                    )}
                    style={{ width: active ? "52%" : done ? "88%" : "40%" }}
                  />
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {!error && (
        <p className="text-center text-xs text-subtle">
          This usually takes a bit — we research your profiles before drafting tasks.
        </p>
      )}
    </div>
  );
}
