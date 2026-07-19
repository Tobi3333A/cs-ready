import { Suspense } from "react";
import type { Metadata } from "next";
import type { UIMessage } from "ai";
import { CoachWorkspace } from "@/components/dashboard/coach/coach-workspace";
import {
  createConversation,
  listConversations,
  loadChat,
} from "@/lib/coach/chat-store";
import { getUserInitials, levelForScore, readinessLevels } from "@/lib/constants";
import type { CoachProfileContext } from "@/lib/coach/types";
import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Coach · CS-Ready",
};

const CATEGORY_LABELS: Record<string, string> = {
  dsa: "Data Structures & Algorithms",
  projects: "Projects & Portfolio",
  github: "Open Source & GitHub",
  system: "System Design",
  resume: "Resume & Experience",
  behavior: "Behavioral & Comms",
};

async function CoachPageContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  const firstName = user.user_metadata.full_name?.split(" ")[0] ?? "there";
  const initials = getUserInitials(user.user_metadata.full_name ?? "");

  const supabase = await createClient();
  const { data: readiness } = await supabase
    .from("readiness_breakdown")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let context: CoachProfileContext = {
    firstName,
    initials,
  };

  if (readiness) {
    const scores = [
      { key: "dsa", score: readiness.dsa as number },
      { key: "projects", score: readiness.projects as number },
      { key: "github", score: readiness.github as number },
      { key: "system", score: readiness.system as number },
      { key: "resume", score: readiness.resume as number },
      { key: "behavior", score: readiness.behavior as number },
    ];
    const weakest = scores.reduce((min, c) => (c.score < min.score ? c : min), scores[0]);
    const level = readinessLevels[levelForScore(readiness.overall_readiness as number)];

    context = {
      ...context,
      overallScore: readiness.overall_readiness as number,
      levelLabel: level.label,
      insightHeadline: readiness.insight_headline as string | undefined,
      weakestCategory: {
        label: CATEGORY_LABELS[weakest.key] ?? weakest.key,
        score: weakest.score,
      },
    };
  }

  const params = await searchParams;
  const qRaw = params.q;
  const initialAutoSend =
    typeof qRaw === "string" ? qRaw.trim() : Array.isArray(qRaw) ? qRaw[0]?.trim() ?? "" : "";

  let initialConversations: Awaited<ReturnType<typeof listConversations>> = [];
  let initialMessages: UIMessage[] = [];

  try {
    initialConversations = await listConversations(user.id);

    if (initialAutoSend) {
      const fresh = await createConversation(user.id);
      initialConversations = [fresh, ...initialConversations];
      initialMessages = [];
    } else if (initialConversations[0]) {
      initialMessages = await loadChat(user.id, initialConversations[0].id);
    }
  } catch {
    initialConversations = [];
    initialMessages = [];
  }

  return (
    <CoachWorkspace
      context={context}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      initialAutoSend={initialAutoSend || null}
    />
  );
}

function CoachLoading() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center lg:h-screen">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
        Loading coach…
      </div>
    </div>
  );
}

export default function CoachPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<CoachLoading />}>
      <CoachPageContent searchParams={searchParams} />
    </Suspense>
  );
}
