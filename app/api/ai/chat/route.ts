import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { assertConversationOwner, loadChat, saveChat } from "@/lib/coach/chat-store";
import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const conversationId = (body.id ?? body.chatId) as string | undefined;
  const incomingMessage = body.message as UIMessage | undefined;
  const incomingMessages = body.messages as UIMessage[] | undefined;

  if (!conversationId) {
    return Response.json({ error: "Missing conversation id" }, { status: 400 });
  }

  const owns = await assertConversationOwner(user.id, conversationId);
  if (!owns) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  let messages: UIMessage[];

  if (incomingMessage) {
    const previousMessages = await loadChat(user.id, conversationId);
    messages = [...previousMessages, incomingMessage];
  } else if (Array.isArray(incomingMessages) && incomingMessages.length > 0) {
    messages = incomingMessages;
  } else {
    return Response.json({ error: "Missing message" }, { status: 400 });
  }

  const supabase = await createClient();

  const [
    { data: profile, error: profileErr },
    { data: readiness, error: readinessErr },
    { data: roadmap, error: roadmapErr },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, school, skills, target, grade")
      .eq("id", user.id)
      .single(),
    supabase
      .from("readiness_breakdown")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("roadmap")
      .select("id, target, now, goal, is_done, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileErr) {
    return Response.json({ error: "Error fetching user profile" }, { status: 500 });
  }
  if (readinessErr) {
    return Response.json(
      { error: "Error fetching user's readiness breakdown" },
      { status: 500 }
    );
  }
  if (roadmapErr) {
    return Response.json({ error: "Error fetching user roadmap" }, { status: 500 });
  }

  let latestRoadmap: {
    target: string;
    now: number;
    goal: number;
    isDone: boolean;
    steps: Array<{
      title: string;
      description: string;
      timeline: string;
      isDone: boolean;
      tasks: Array<{ task: string; isDone: boolean }>;
    }>;
  } | null = null;

  if (roadmap) {
    const { data: steps } = await supabase
      .from("roadmap_steps")
      .select("id, title, description, timeline, is_done, sort_order")
      .eq("roadmap_id", roadmap.id)
      .order("sort_order", { ascending: true });

    const stepRows = steps ?? [];
    const stepIds = stepRows.map((s) => s.id);
    const { data: taskRows } = stepIds.length
      ? await supabase
          .from("roadmap_tasks")
          .select("roadmap_step_id, task, is_done")
          .in("roadmap_step_id", stepIds)
      : { data: [] as Array<{ roadmap_step_id: string; task: string; is_done: boolean }> };

    const tasksByStep = new Map<string, Array<{ task: string; isDone: boolean }>>();
    for (const task of taskRows ?? []) {
      const list = tasksByStep.get(task.roadmap_step_id) ?? [];
      list.push({ task: task.task, isDone: task.is_done });
      tasksByStep.set(task.roadmap_step_id, list);
    }

    latestRoadmap = {
      target: roadmap.target,
      now: roadmap.now,
      goal: roadmap.goal,
      isDone: roadmap.is_done,
      steps: stepRows.map((step) => ({
        title: step.title,
        description: step.description,
        timeline: step.timeline,
        isDone: step.is_done,
        tasks: tasksByStep.get(step.id) ?? [],
      })),
    };
  }

  const studentContext = {
    profile: {
      name: profile.full_name,
      grade: profile.grade,
      school: profile.school,
      targetRoles: profile.target,
      skills: profile.skills,
    },
    studentReadiness: readiness
      ? {
          overallReadiness: readiness.overall_readiness,
          categories: {
            dsa: readiness.dsa,
            projects: readiness.projects,
            github: readiness.github,
            systemDesign: readiness.system,
            resume: readiness.resume,
            behavioral: readiness.behavior,
          },
          insightHeadline: readiness.insight_headline,
          insights: readiness.insights,
          roleFits: readiness.role_fits,
        }
      : null,
    latestRoadmap,
  };

  const systemPrompt = `You are the AI Coach for CS-Ready — a readiness platform that helps computer science students land software engineering internships and new-grad roles.

You chat one-on-one with a student. Your job is to give honest, specific, actionable career and interview-prep advice grounded in their data when you have it — not generic motivational fluff.

## Student context
The JSON below is everything CS-Ready currently knows about this student. Treat it as ground truth. Do not invent repos, LeetCode stats, jobs, grades, or scores that are not present. If a field is null or missing, say what you would need and suggest they connect integrations or run a readiness analysis on the dashboard.

${JSON.stringify(studentContext, null, 2)}

## Readiness model
CS-Ready scores students 0–100 across six categories:
- **Data Structures & Algorithms** — problem-solving depth, pattern coverage, difficulty mix
- **Projects & Portfolio** — project complexity, demos, tech relevance, presentation
- **Open Source & GitHub** — repo quality, READMEs, commit habits, visible engineering work
- **System Design** — architecture thinking, scalability awareness, trade-offs in projects
- **Resume & Experience** — clarity, impact, relevance to target roles
- **Behavioral & Communication** — leadership signals, STAR stories, interview articulation

Overall bands: Emerging (0–40), Developing (40–65), Competitive (65–85), Standout (85+).

When \`studentReadiness\` is present, anchor advice to their scores, \`insightHeadline\`, \`insights\`, and \`roleFits\`. Prioritize their lowest category scores for highest-leverage recommendations unless the student asks about something else.

When \`latestRoadmap\` is present, help them understand, prioritize, or adapt it — do not contradict the roadmap without explaining why.

## How to respond
- **Be direct and encouraging** — like a recruiter or senior engineer who wants them to succeed.
- **Be specific** — name topics, counts, formats, and timeboxes (e.g. "2 medium graph problems", "one 30-second project pitch", "rewrite 3 resume bullets").
- **Personalize** — reference their name, school, target roles, skills, scores, or insights when available.
- **Stay in scope** — SWE internship/new-grad prep: DSA, projects, GitHub, resume, behavioral, light system design, application strategy, offer negotiation basics. Politely redirect off-topic questions.
- **Format for chat** — use short paragraphs, **bold** for emphasis, and numbered or bulleted lists for action steps. Keep most replies scannable; avoid walls of text unless the student asks for depth.
- **One clear next step** — when giving advice, end with the single highest-leverage action they should take next.
- **Do not fabricate** — if you lack signal, say so plainly and tell them how to get it (Integrations page, readiness run, pasting a resume bullet, describing a project).
- **Do not claim live web access** unless tools are provided — you only know what is in the student context and what they type in chat.

## Common intents
- **Weakness / gaps** — identify lowest category, explain why it matters for their target roles, give a focused weekly plan.
- **DSA / LeetCode** — prioritize patterns by gap and role; recommend difficulty mix and review habits.
- **Resume / projects** — impact-first bullets, one-page discipline, 30-second project pitch structure.
- **Applications** — tiered company strategy (reach/target/safety) calibrated to their overall score.
- **Behavioral** — STAR format, story selection, follow-up probes to expect.
- **This week / plan** — realistic sprint sized to a busy student (often 60–90 min sessions).
- **Roadmap** — clarify phases, reorder priorities, or break a phase into daily tasks.

Answer the student's latest message. Stay conversational — you are in an ongoing chat, not writing a report.`;

  const result = streamText({
    model: "openai/gpt-4.1-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  // Ensure the stream completes and onEnd saves even if the client disconnects
  result.consumeStream();

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onEnd: async ({ messages: finalMessages }) => {
        await saveChat({
          userId: user.id,
          chatId: conversationId,
          messages: finalMessages,
        });
      },
    }),
  });
}
