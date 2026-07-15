import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GenerateRoadmapButton } from "./generateRoadmapButton";
import { RoadmapTasks } from "./RoadmapTasks";

export const metadata: Metadata = {
  title: "Roadmap · CS-Ready",
};

type Roadmap = {
  created_at: string;
  goal: number;
  id: string;
  is_done: boolean;
  now: number;
  target: string;
  updated_at: string;
  user_id: string;
  steps: {
    created_at: string;
    description: string;
    id: string;
    is_done: boolean;
    roadmap_id: string;
    sort_order: number;
    timeline: string;
    title: string;
    updated_at: string;
    tasks: {
      created_at: string;
      id: string;
      is_done: boolean;
      roadmap_step_id: string;
      task: string;
      updated_at: string;
      }[];
  }[]
}

function roadmapStatusMeta(done: boolean) {
  if (done) return { tone: "accent" as const, label: "Completed", dot: "bg-accent-500" };
  return { tone: "neutral" as const, label: "In progress", dot: "bg-white/20" };
}

function statusMeta(done: boolean) {
  if (done) return { tone: "accent" as const, label: "Completed", dot: "bg-accent-500" };
  return { tone: "neutral" as const, label: "Unfinished", dot: "bg-white/20" }
};

export default async function RoadmapPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const { data, error: roadmapErr } = await supabase
    .from('roadmap')
    .select(`*,
      steps:roadmap_steps(*,
        tasks:roadmap_tasks(*)
      )`
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (roadmapErr) console.error('Error fetching roadmap');
  const roadmap = data as Roadmap | null;

  if (roadmapErr || !roadmap) {
    return (
      <>
        <Topbar
          title="Your roadmap"
          subtitle="A personalized, week-by-week plan to reach Standout."
          action={
            <GenerateRoadmapButton variant="outline" />
          }
        />
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-4 p-5 py-24 text-center lg:p-8">
          <p className="text-xl font-semibold text-foreground">No roadmap yet</p>
          <p className="max-w-md text-sm text-muted">
            We couldn&apos;t find a roadmap for your account. Generate one to get a
            personalized week-by-week plan.
          </p>
          <GenerateRoadmapButton />
        </div>
      </>
    );
  }

  const roadmapMeta = roadmapStatusMeta(roadmap.is_done);

  return (
    <>
      <Topbar
        title="Your roadmap"
        subtitle="A personalized, week-by-week plan to reach Standout."
        action={
          <GenerateRoadmapButton variant="outline" disabled={!roadmap.is_done} />
        }
      />

      <div className="mx-auto w-full max-w-4xl space-y-6 p-5 lg:p-8">
        {roadmap.is_done && (
          <Card className="border-accent-500/30 bg-accent-500/10">
            <CardBody className="flex items-center gap-3 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-500/20 text-lg text-accent-400">
                ✓
              </span>
              <div>
                <p className="font-semibold text-foreground">Roadmap complete</p>
                <p className="text-sm text-muted">
                  You&apos;ve finished every step. Generate a new roadmap when you&apos;re ready for your next goal.
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-brand-600/15 to-surface">
          <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted">Target</p>
                <Badge tone={roadmapMeta.tone} dot>
                  {roadmapMeta.label}
                </Badge>
              </div>
              <p className="text-xl font-semibold text-foreground">
                {roadmap.target}
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{roadmap.now}</p>
                <p className="text-xs text-subtle">now</p>
              </div>
              <div className="text-2xl text-subtle">→</div>
              <div>
                <p className="text-2xl font-bold text-accent-400">{roadmap.goal}</p>
                <p className="text-xs text-subtle">goal</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="relative space-y-4 pl-6">
          {/* Timeline line */}
          <div className="absolute bottom-4 left-[7px] top-4 w-px bg-border" />

          {roadmap.steps.map((step) => {
            const meta = statusMeta(step.is_done);
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
                        {step.timeline}
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
                  <RoadmapTasks tasks={step.tasks} />
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
