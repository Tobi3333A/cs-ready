import { formatInline } from "@/components/dashboard/coach/coach-markdown";
import { buildWelcomeMessage } from "@/lib/coach/constants";
import type { CoachProfileContext } from "@/lib/coach/types";

export function CoachLanding({ context }: { context: CoachProfileContext }) {
  const text = buildWelcomeMessage(context);

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
        <div className="animate-in rounded-2xl border border-border/80 bg-gradient-to-br from-surface via-surface-2/50 to-brand-500/5 p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl text-white shadow-lg shadow-brand-600/25">
              🤖
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                CS-Ready <span className="text-gradient">AI Coach</span>
              </h2>
              <p className="mt-1 text-sm text-subtle">
                Personalized guidance from your GitHub, LeetCode, resume, and readiness scores.
              </p>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm text-white">
              🤖
            </span>
            <div className="rounded-2xl rounded-tl-md border border-border/80 bg-surface/90 px-4 py-3 text-sm leading-relaxed text-muted ring-1 ring-inset ring-white/[0.03]">
              <p className="whitespace-pre-wrap">{formatInline(text)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
