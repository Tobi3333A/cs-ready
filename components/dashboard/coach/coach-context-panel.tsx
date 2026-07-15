import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { cn } from "@/lib/utils";
import type { CoachProfileContext } from "@/lib/coach/types";

export function CoachContextPanel({
  context,
  className,
}: {
  context: CoachProfileContext;
  className?: string;
}) {
  const hasScore = context.overallScore != null && context.levelLabel;

  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col border-l border-border/60 bg-surface/40 xl:flex",
        className
      )}
    >
      <div className="border-b border-border/60 px-5 py-4">
        <p className="text-sm font-semibold text-foreground">Your context</p>
        <p className="text-xs text-subtle">What the coach knows about you</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {hasScore ? (
          <>
            <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-2/50 p-5 text-center">
              <ScoreRing
                value={context.overallScore!}
                label={context.levelLabel!}
                sublabel="readiness"
                size={128}
                strokeWidth={10}
              />
            </div>

            {context.insightHeadline && (
              <div className="rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-accent-500/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-300">
                  Latest insight
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-foreground">
                  {context.insightHeadline}
                </p>
              </div>
            )}

            {context.weakestCategory && (
              <div className="rounded-xl border border-border bg-surface-2/40 p-4">
                <p className="text-xs text-subtle">Focus area</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {context.weakestCategory.label}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      style={{ width: `${context.weakestCategory.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-muted">
                    {context.weakestCategory.score}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-2/20 p-5 text-center">
            <span className="text-2xl">🔗</span>
            <p className="mt-3 text-sm font-medium text-foreground">No profile yet</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Connect integrations and run a readiness analysis for personalized coaching.
            </p>
            <Button href="/dashboard/integrations" variant="secondary" size="sm" className="mt-4 w-full">
              Connect sources
            </Button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface-2/30 p-4">
          <p className="text-xs font-medium text-foreground">Quick links</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                href="/dashboard/roadmap"
                className="block rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                🗺️ View roadmap
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                📊 Readiness breakdown
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/integrations"
                className="block rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                🔗 Manage integrations
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
