"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = { id: number; role: "user" | "ai"; text: string };

const seedMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Hey Alex 👋 I've analyzed your GitHub, LeetCode, and resume. You're at a 72 — competitive for SWE internships. Ask me anything, or try a prompt below.",
  },
];

const suggestions = [
  "What's my biggest weakness right now?",
  "Which LeetCode topics should I focus on?",
  "How do I make my resume stand out?",
  "Am I ready to apply to top companies?",
];

// Canned responses so the interface feels alive. Real AI responses are wired
// up on the backend separately.
const cannedReply =
  "Great question. Based on your profile, the highest-leverage move is closing your graph/DP gap on LeetCode and adding architecture context to your top two repos. Want me to break that into a week-by-week plan?";

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const nextId = useRef(seedMessages.length + 1);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const userMsg: Message = { id: nextId.current++, role: "user", text: clean };
    const aiMsg: Message = { id: nextId.current++, role: "ai", text: cannedReply };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setDraft("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] w-full max-w-3xl flex-col lg:h-[calc(100vh-5rem)]">
      <div className="flex-1 space-y-5 overflow-y-auto p-5 lg:p-8">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
          >
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm",
                m.role === "ai"
                  ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white"
                  : "bg-elevated text-foreground ring-1 ring-inset ring-border"
              )}
            >
              {m.role === "ai" ? "🤖" : "AC"}
            </span>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "ai"
                  ? "rounded-tl-sm bg-surface text-foreground ring-1 ring-inset ring-border"
                  : "rounded-tr-sm bg-brand-600 text-white"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 pl-12">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-muted transition-colors hover:border-brand-400/60 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-4 lg:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface-2/60 p-2 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/25"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask your AI coach anything…"
            className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-subtle focus:outline-none"
          />
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            Send
            <span aria-hidden>↑</span>
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-subtle">
          The coach uses your connected profile for context. Responses are illustrative.
        </p>
      </div>
    </div>
  );
}
