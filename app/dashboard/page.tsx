import type { Metadata } from "next";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { levelForScore, readinessLevels } from "@/lib/constants";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GenerateRoadmapButton } from "./roadmap/generateRoadmapButton";
import { DashboardShell } from "./DashboardShell";

export const metadata: Metadata = {
  title: "Overview · CS-Ready",
};

type ScoreCategory = {
  key: string;
  label: string;
  score: number;
  summary: string;
  icon: string;
};

type RoleFit = {
  role: string;
  match: number
};

type RoadmapPreview = {
  steps: {
    id: string;
    is_done: boolean;
    sort_order: number;
    timeline: string;
    title: string;
    description: string;
    tasks: {
      id: string;
      is_done: boolean;
      task: string;
    }[];
  }[];
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const { data: readiness, error } = await supabase
    .from('readiness_breakdown')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !readiness) {
    const firstName = user.user_metadata.full_name?.split(" ")[0] ?? "there";
    return <DashboardEmptyState firstName={firstName} />;
  }

  const roleFits = Array.isArray(readiness.role_fits) ? (readiness.role_fits as RoleFit[]) : [];

  const scoreCategories: ScoreCategory[] = [
    {
      key: "dsa",
      label: "Data Structures & Algorithms",
      score: readiness.dsa,
      summary: "Solid on arrays & trees. Graphs and DP need reps.",
      icon: "🧠",
    },
    {
      key: "projects",
      label: "Projects & Portfolio",
      score: readiness.projects,
      summary: "Two strong full-stack projects with live demos.",
      icon: "🚀",
    },
    {
      key: "github",
      label: "Open Source & GitHub",
      score: readiness.github,
      summary: "Consistent commits, but READMEs could go deeper.",
      icon: "🐙",
    },
    {
      key: "systemdesign",
      label: "System Design",
      score: readiness.system,
      summary: "Good fundamentals; practice scaling & trade-offs.",
      icon: "🏗️",
    },
    {
      key: "resume",
      label: "Resume & Experience",
      score: readiness.resume,
      summary: "Quantified impact well. Trim to a single page.",
      icon: "📄",
    },
    {
      key: "behavioral",
      label: "Behavioral & Comms",
      score: readiness.behavior,
      summary: "Clear STAR stories. Add more leadership examples.",
      icon: "💬",
    },
  ];

  const level = readinessLevels[levelForScore(readiness.overall_readiness)];

  const { data: roadmapData } = await supabase
    .from("roadmap")
    .select(
      `*,
      steps:roadmap_steps(*,
        tasks:roadmap_tasks(*)
      )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const roadmap = roadmapData as RoadmapPreview | null;
  const sortedSteps = roadmap
    ? [...roadmap.steps].sort((a, b) => a.sort_order - b.sort_order)
    : [];
  const currentStep =
    sortedSteps.find((step) => !step.is_done) ?? sortedSteps[0] ?? null;
  const previewTasks = currentStep
    ? currentStep.tasks.filter((t) => !t.is_done).slice(0, 3)
    : [];

  const firstName = user.user_metadata.full_name?.split(" ")[0] ?? "there";

  return (
    <DashboardShell
      title={`Welcome back, ${firstName}`}
      subtitle="Here's where your internship readiness stands today."
      showReanalyze
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 p-5 lg:p-8">
        {/* Top row: score + AI insight */}
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="flex flex-col items-center p-6 text-center">
            <p className="text-sm text-muted">Overall readiness</p>
            <div className="my-4">
              <ScoreRing value={readiness.overall_readiness} label={level.label} sublabel="for SWE internships" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-subtle">{85 - readiness.overall_readiness} to Standout</span>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/20 text-base">
                  🤖
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Coach insight</p>
                  {/* <p className="text-xs text-subtle">{data..updated}</p> */}
                </div>
              </div>
              <h2 className="mt-4 text-xl font-semibold leading-snug text-foreground">
                {readiness.insight_headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{readiness.insights}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/dashboard/roadmap" size="sm">
                  See my roadmap
                </Button>
                <Button href="/dashboard/coach" variant="secondary" size="sm">
                  Ask a question
                </Button>
              </div>
            </div>
          </Card>
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

        {/* Roadmap teaser + role fit */}
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader
              title="Do this next"
              description={
                currentStep
                  ? `${currentStep.timeline}: ${currentStep.title}`
                  : "A snapshot of your current roadmap focus."
              }
              action={
                <Button href="/dashboard/roadmap" variant="ghost" size="sm">
                  View roadmap
                </Button>
              }
            />
            <CardBody>
              {!roadmap || !currentStep ? (
                <div className="rounded-xl border border-dashed border-border bg-surface-2/20 p-5 text-center sm:flex sm:items-center sm:justify-between sm:gap-4 sm:text-left">
                  <div>
                    <p className="font-medium text-foreground">No roadmap yet</p>
                    <p className="mt-1 text-sm text-muted">
                      Generate a personalized plan to see your next actions here.
                    </p>
                  </div>
                  <div className="mt-4 shrink-0 sm:mt-0">
                    <GenerateRoadmapButton />
                  </div>
                </div>
              ) : previewTasks.length === 0 ? (
                <div className="rounded-xl border border-border bg-surface-2/40 p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {currentStep.is_done
                        ? "This phase is complete"
                        : "No open tasks in this phase"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Head to your roadmap to continue or generate the next plan.
                    </p>
                  </div>
                  <Button
                    href="/dashboard/roadmap"
                    variant="secondary"
                    size="sm"
                    className="mt-4 shrink-0 sm:mt-0"
                  >
                    Open roadmap
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border/60 rounded-xl border border-border bg-surface-2/40">
                  {previewTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-xs">
                        ➜
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">
                          {task.task}
                        </p>
                        <p className="mt-1 text-xs text-subtle">
                          {currentStep.timeline} · {currentStep.title}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Role fit" description="Match for your targets." />
            <CardBody className="space-y-4">
              {roleFits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-surface-2/20 p-4">
                  <p className="text-sm font-medium text-foreground">No role fit yet</p>
                  <p className="mt-1 text-xs text-muted">
                    Set target roles, then re-analyze to see your match.
                  </p>
                </div>
              ) : (
                roleFits.map((role, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{role.role}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {role.match}%
                      </span>
                    </div>
                    <Progress value={role.match} />
                  </div>
                ))
              )}
              <Button href="/dashboard/profile" variant="outline" size="sm" className="w-full">
                Edit target roles
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
