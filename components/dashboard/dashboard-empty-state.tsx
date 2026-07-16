import { GenerateReadinessButton } from "@/app/dashboard/generateReadinessButton";
import { DashboardShell } from "@/app/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type ScoreCategory = {
  label: string;
  icon: string;
}

const steps = [
  {
    n: "01",
    icon: "👤",
    title: "Complete your profile",
    body: "Add your target roles and graduation year so we know what you're aiming for.",
    href: "/dashboard/profile",
    cta: "Edit profile",
  },
  {
    n: "02",
    icon: "🔗",
    title: "Connect your signals",
    body: "Link GitHub, LeetCode, and upload your resume — the same signals recruiters review.",
    href: "/dashboard/integrations",
    cta: "Connect integrations",
  },
  {
    n: "03",
    icon: "🧭",
    title: "Generate your score",
    body: "Run your first analysis to get a readiness score, category breakdown, and AI insights.",
  },
];

export const scoreCategories: ScoreCategory[] = [
  {
    label: "Data Structures & Algorithms",
    icon: "🧠",
  },
  {
    label: "Projects & Portfolio",
    icon: "🚀",
  },
  {
    label: "Open Source & GitHub",
    icon: "🐙",
  },
  {
    label: "System Design",
    icon: "🏗️",
  },
  {
    label: "Resume & Experience",
    icon: "📄",
  },
  {
    label: "Behavioral & Comms",
    icon: "💬",
  },
];

function EmptyScoreRing() {
  const size = 176;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;

  return (
    <div
      className="relative inline-grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeDasharray="8 10"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-4xl font-bold text-subtle">—</div>
          <div className="mt-1 text-sm font-medium text-muted">Not yet scored</div>
          <div className="text-xs text-subtle">for SWE internships</div>
        </div>
      </div>
    </div>
  );
}

export function DashboardEmptyState({ firstName }: { firstName: string }) {
  return (
    <DashboardShell
      title={`Welcome, ${firstName}`}
      subtitle="Connect your profile to unlock your readiness score."
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 p-5 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="flex flex-col items-center border-dashed p-6 text-center">
            <p className="text-sm text-muted">Overall readiness</p>
            <div className="my-4">
              <EmptyScoreRing />
            </div>
            <Badge tone="neutral">Awaiting first analysis</Badge>
          </Card>

          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="relative">
              <Badge tone="accent" dot className="mb-4">
                Get started in minutes
              </Badge>
              <h2 className="text-2xl font-semibold leading-snug text-foreground">
                Your readiness score is waiting
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                CS-Ready analyzes your GitHub, LeetCode, and resume against your target
                roles — then gives you one honest score, a full breakdown, and ranked
                next steps.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <GenerateReadinessButton />
                <Button href="/dashboard/integrations" variant="secondary" size="sm">
                  Connect integrations
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <CardBody className="p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-foreground">How it works</h3>
              <p className="mt-1 text-sm text-muted">
                Three quick steps to your first readiness score and AI insights.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="rounded-xl border border-border bg-surface-2/40 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-lg">
                      {step.icon}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
                      Step {step.n}
                    </span>
                  </div>
                  <h4 className="mt-4 font-medium text-foreground">{step.title}</h4>
                  <p className="mt-2 text-sm text-muted">{step.body}</p>
                  {"href" in step && step.href ? (
                    <Button
                      href={step.href}
                      variant="ghost"
                      size="sm"
                      className="mt-4 px-0 text-brand-300 hover:bg-transparent hover:text-brand-200"
                    >
                      {step.cta} →
                    </Button>
                  ) : (
                    <div className="mt-4">
                      <GenerateReadinessButton
                        variant="ghost"
                        size="sm"
                        label="Get started →"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardBody className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  What you&apos;ll unlock
                </h3>
                <p className="mt-1 text-sm text-muted">
                  A preview of your dashboard once analysis is complete.
                </p>
              </div>
              <Badge tone="neutral">6 categories</Badge>
            </div>
            <div className="mt-6 grid gap-4 opacity-50 sm:grid-cols-2">
              {scoreCategories.map((category, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-dashed border-border/80 bg-surface-2/20 p-4"
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
                        <p className="text-xs text-subtle">—</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold tabular-nums text-subtle">—</span>
                  </div>
                  <Progress value={0} className="mt-3 opacity-60" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
