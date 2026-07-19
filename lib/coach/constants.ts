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
