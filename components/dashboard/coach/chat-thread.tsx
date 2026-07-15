"use client";

import { useEffect, useRef } from "react";
import { MessageBubble, TypingIndicator } from "@/components/dashboard/coach/message-bubble";
import type { CoachConversation, CoachProfileContext } from "@/lib/coach/types";
import { buildWelcomeMessage } from "@/lib/coach/constants";

function WelcomeCard({ context }: { context: CoachProfileContext }) {
  const text = buildWelcomeMessage(context);
  return (
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
          <WelcomeText content={text} />
        </div>
      </div>
    </div>
  );
}

function WelcomeText({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  );
}

export function ChatThread({
  conversation,
  context,
  isTyping,
}: {
  conversation: CoachConversation | null;
  context: CoachProfileContext;
  isTyping?: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = conversation?.messages ?? [];
  const showWelcome = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 lg:px-8 lg:py-8">
        {showWelcome && <WelcomeCard context={context} />}

        {messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            message={m}
            userInitials={context.initials}
            isLatest={i === messages.length - 1 && !isTyping}
          />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
