import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  levelForScore,
  overallScore,
  readinessLevels,
  recommendations,
  scoreCategories,
  targetRoles,
} from "@/lib/constants";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Overview · CS-Ready",
};

const impactTone = {
  high: "danger",
  medium: "warning",
  low: "neutral",
} as const;

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  const level = readinessLevels[levelForScore(overallScore)];

  return (
    <>
      <Topbar
        title={`Welcome back, ${user.user_metadata.full_name.split(" ")[0]}`}
        subtitle="Here's where your internship readiness stands today."
        action={
          <Button href="/onboarding" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Re-analyze
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-6xl space-y-6 p-5 lg:p-8">
        {/* Top row: score + AI insight */}
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="flex flex-col items-center p-6 text-center">
            <p className="text-sm text-muted">Overall readiness</p>
            <div className="my-4">
              <ScoreRing value={overallScore} label={level.label} sublabel="for SWE internships" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge tone="accent" dot>
                +6 this month
              </Badge>
              <span className="text-subtle">13 to Standout</span>
            </div>
          </Card>
{/* 
          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/20 text-base">
                  🤖
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Coach insight</p>
                  <p className="text-xs text-subtle">{aiInsight.updated}</p>
                </div>
              </div>
              <h2 className="mt-4 text-xl font-semibold leading-snug text-foreground">
                {aiInsight.headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{aiInsight.body}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/dashboard/roadmap" size="sm">
                  See my roadmap
                </Button>
                <Button href="/dashboard/coach" variant="secondary" size="sm">
                  Ask a question
                </Button>
              </div>
            </div>
          </Card> */}
        </div>

        {/* Category breakdown */}
        <Card>
          <CardHeader
            title="Readiness breakdown"
            description="How you score across what interviewers evaluate."
            action={<Badge tone="neutral">6 categories</Badge>}
          />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            {scoreCategories.map((c) => (
              <div
                key={c.key}
                className="rounded-xl border border-border bg-surface-2/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-lg">
                      {c.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.label}</p>
                      <p className="text-xs text-subtle">
                        {readinessLevels[levelForScore(c.score)].label}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-foreground">
                    {c.score}
                  </span>
                </div>
                <Progress value={c.score} className="mt-3" />
                <p className="mt-3 text-xs text-muted">{c.summary}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Recommendations + roles */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader
              title="Do this next"
              description="Ranked by impact on your target roles."
              action={
                <Button href="/dashboard/roadmap" variant="ghost" size="sm">
                  View all
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-surface-2/40 p-4 transition-colors hover:border-border-strong"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-sm">
                    ➜
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{rec.title}</p>
                      <Badge tone={impactTone[rec.impact]}>{rec.impact} impact</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{rec.detail}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-subtle">
                      <span>{rec.category}</span>
                      <span>·</span>
                      <span>{rec.estimate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Role fit" description="Match for your targets." />
              <CardBody className="space-y-4">
                {targetRoles.map((role) => (
                  <div key={role.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{role.title}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {role.match}%
                      </span>
                    </div>
                    <Progress value={role.match} />
                  </div>
                ))}
                <Button href="/dashboard/profile" variant="outline" size="sm" className="w-full">
                  Edit target roles
                </Button>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-accent-500/10 to-surface">
              <CardBody className="p-6">
                <p className="text-2xl">🔥</p>
                <p className="mt-2 text-2xl font-bold text-foreground">12-day streak</p>
                <p className="mt-1 text-sm text-muted">
                  Consistency compounds. Keep shipping and solving daily.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
