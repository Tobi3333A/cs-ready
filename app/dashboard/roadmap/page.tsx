import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { roadmap } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Roadmap · CS-Ready",
};

const statusMeta = {
  done: { tone: "accent" as const, label: "Completed", dot: "bg-accent-500" },
  active: { tone: "brand" as const, label: "In progress", dot: "bg-brand-500" },
  upcoming: { tone: "neutral" as const, label: "Upcoming", dot: "bg-white/20" },
};

// Show the roadmap in a sensible order: foundation first, then the weeks.
const ordered = [...roadmap].sort((a, b) => {
  const rank = { done: 0, active: 1, upcoming: 2 };
  return rank[a.status] - rank[b.status];
});

export default function RoadmapPage() {
  return (
    <>
      <Topbar
        title="Your roadmap"
        subtitle="A personalized, week-by-week plan to reach Standout."
      />

      <div className="mx-auto w-full max-w-4xl space-y-6 p-5 lg:p-8">
        <Card className="bg-gradient-to-br from-brand-600/15 to-surface">
          <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-sm text-muted">Target</p>
              <p className="text-xl font-semibold text-foreground">
                Reach an 85+ readiness score in 6 weeks
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">72</p>
                <p className="text-xs text-subtle">now</p>
              </div>
              <div className="text-2xl text-subtle">→</div>
              <div>
                <p className="text-2xl font-bold text-accent-400">85</p>
                <p className="text-xs text-subtle">goal</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="relative space-y-4 pl-6">
          {/* Timeline line */}
          <div className="absolute bottom-4 left-[7px] top-4 w-px bg-border" />

          {ordered.map((step) => {
            const meta = statusMeta[step.status];
            return (
              <div key={step.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-6 top-6 h-3.5 w-3.5 rounded-full ring-4 ring-canvas",
                    meta.dot
                  )}
                />
                <Card hover className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium uppercase tracking-wide text-subtle">
                        {step.week}
                      </span>
                      <Badge tone={meta.tone} dot>
                        {meta.label}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{step.description}</p>
                  <ul className="mt-4 space-y-2">
                    {step.tasks.map((task) => (
                      <li key={task} className="flex items-center gap-2.5 text-sm">
                        <span
                          className={cn(
                            "grid h-5 w-5 shrink-0 place-items-center rounded-md text-[10px]",
                            step.status === "done"
                              ? "bg-accent-500/20 text-accent-400"
                              : "bg-white/5 text-subtle"
                          )}
                        >
                          {step.status === "done" ? "✓" : "○"}
                        </span>
                        <span
                          className={cn(
                            step.status === "done" ? "text-subtle line-through" : "text-muted"
                          )}
                        >
                          {task}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
