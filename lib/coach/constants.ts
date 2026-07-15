import type { CoachProfileContext } from "./types";

export const COACH_SUGGESTIONS = [
  "What's my biggest weakness right now?",
  "Which LeetCode topics should I focus on?",
  "How do I make my resume stand out?",
  "Am I ready to apply to top companies?",
  "What should I do this week to improve?",
  "How do I explain my projects in interviews?",
] as const;

export function buildWelcomeMessage(ctx: CoachProfileContext): string {
  if (ctx.overallScore != null && ctx.levelLabel) {
    const weakness = ctx.weakestCategory
      ? ` Your lowest area is **${ctx.weakestCategory.label}** (${ctx.weakestCategory.score}/100) — we can dig into that first.`
      : "";
    return `Hey ${ctx.firstName} 👋 I've reviewed your connected profile. You're at **${ctx.overallScore}** — **${ctx.levelLabel}** for SWE internships.${weakness}\n\nAsk me anything about your readiness, roadmap, or interview prep. Or tap a prompt below to get started.`;
  }

  return `Hey ${ctx.firstName} 👋 I'm your CS-Ready coach. Connect GitHub, LeetCode, and your resume on the Integrations page, then run a readiness analysis — I'll use that context to give you specific advice.\n\nYou can still ask general career questions anytime.`;
}

/** Illustrative replies until the streaming API is wired up. */
export function demoCoachReply(question: string, ctx: CoachProfileContext): string {
  const q = question.toLowerCase();

  if (q.includes("weakness") || q.includes("weakest") || q.includes("gap")) {
    const cat = ctx.weakestCategory?.label ?? "graphs and dynamic programming";
    return `Your highest-leverage gap is **${cat}**. Interviewers weight DSA heavily for intern loops, so closing this moves your overall score faster than polishing already-strong areas.\n\n**This week:**\n1. Solve 3 medium graph problems (BFS/DFS + one shortest-path variant)\n2. Write a one-paragraph "why this matters" note after each solve\n3. Re-run readiness after 5–7 days of consistent reps\n\nWant me to turn this into a day-by-day plan?`;
  }

  if (q.includes("leetcode") || q.includes("dsa") || q.includes("coding")) {
    return `Based on typical intern bar and your profile shape, prioritize in this order:\n\n1. **Graphs** — BFS, DFS, topological sort, shortest path\n2. **Dynamic programming** — 1D then 2D; focus on state definition\n3. **Binary search on answer** — underrated pattern in harder mediums\n\nAim for **2 mediums/day** with spaced repetition on misses. Quality > quantity — always articulate time/space complexity out loud.`;
  }

  if (q.includes("resume")) {
    return `Strong resumes for intern roles lead with **impact**, not responsibilities.\n\n**Quick wins:**\n- Start bullets with verbs + metrics ("Reduced API latency 40%…")\n- One line per project: problem → your role → tech → outcome\n- Trim to **one page**; link GitHub/demo at the top\n- Mirror keywords from target job descriptions (without stuffing)\n\nPaste a bullet you're unsure about and I'll rewrite it.`;
  }

  if (q.includes("ready") || q.includes("apply") || q.includes("company")) {
    const score = ctx.overallScore ?? 72;
    const verdict =
      score >= 75
        ? "You're in solid apply territory for many companies — start submitting while you keep grinding."
        : score >= 60
          ? "You're competitive for a wide net of internships; be selective on hyper-competitive teams until DSA gaps close."
          : "Build 2–3 more weeks of focused reps before mass-applying to top-tier loops.";
    return `${verdict}\n\n**Application strategy:**\n- **Tier A** (reach): 5–8 companies where bar is highest\n- **Tier B** (target): 15–20 where your profile aligns\n- **Tier C** (safety): 5+ with higher acceptance rates\n\nParallelize applications with weekly DSA maintenance — don't wait for "perfect."`;
  }

  if (q.includes("week") || q.includes("plan") || q.includes("roadmap")) {
    return `Here's a focused **7-day sprint**:\n\n- **Mon–Wed** — 2 medium LeetCode (graph/DP) + review\n- **Thu** — Refine one resume bullet per top project\n- **Fri** — 45-min mock behavioral (STAR format)\n- **Sat** — System design primer: caching + load balancing\n- **Sun** — Re-analyze readiness + adjust next week\n\nKeep sessions **90 min max** — consistency beats marathon cramming.`;
  }

  if (q.includes("interview") || q.includes("project") || q.includes("explain")) {
    return `Use the **30-second project pitch**:\n\n1. **Hook** — what problem and who it helps\n2. **Your role** — what *you* built (be specific)\n3. **Technical depth** — one interesting decision/trade-off\n4. **Outcome** — users, metrics, or what you learned\n\nPractice until you can deliver it without slides. Interviewers probe the trade-off in step 3 — have a second layer ready.`;
  }

  return `Great question. Based on your profile, the highest-leverage move right now is tightening **${ctx.weakestCategory?.label ?? "DSA fundamentals"}** while making your top two projects easier to understand in under 30 seconds.\n\nI can break that into a week-by-week plan, mock interview prompts, or resume bullets — what would help most?`;
}
