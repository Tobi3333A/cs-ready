"use client";

import { useEffect, useRef, useState } from "react";
import { ChatComposer } from "@/components/dashboard/coach/chat-composer";
import { CoachMarkdown } from "@/components/dashboard/coach/coach-markdown";
import { cn } from "@/lib/utils";
import type { CoachConversation, CoachMessage, CoachProfileContext } from "@/lib/coach/types";

export function CoachChat({
  conversation,
  context,
  draft,
  onDraftChange,
  onSend,
  isTyping = false,
}: {
  conversation: CoachConversation;
  context: CoachProfileContext;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  isTyping?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [showJump, setShowJump] = useState(false);

  const messages = conversation.messages;

  useEffect(() => {
    if (!stickToBottom) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping, stickToBottom]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setStickToBottom(nearBottom);
    setShowJump(!nearBottom && messages.length > 0);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-canvas/80 to-transparent" />

        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-1 flex items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {conversation.title}
              </p>
              <p className="mt-0.5 text-[11px] text-subtle">
                {messages.length} message{messages.length === 1 ? "" : "s"}
                {context.overallScore != null
                  ? ` · ${context.overallScore} · ${context.levelLabel}`
                  : ""}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent-500/20 bg-accent-500/10 px-2.5 py-1 text-[10px] font-medium text-accent-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
              Live session
            </span>
          </div>

          {messages.map((message, i) => (
            <ChatMessageRow
              key={message.id}
              message={message}
              userInitials={context.initials}
              isLatest={i === messages.length - 1 && !isTyping}
            />
          ))}

          {isTyping && <TypingRow />}
          <div ref={bottomRef} className="h-px shrink-0" />
        </div>
      </div>

      {showJump && (
        <button
          type="button"
          onClick={() => {
            setStickToBottom(true);
            setShowJump(false);
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-[7.5rem] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-surface/95 px-3 py-1.5 text-xs font-medium text-muted shadow-lg shadow-black/30 backdrop-blur-md transition-colors hover:border-brand-400/40 hover:text-foreground"
        >
          <ChevronDownIcon />
          Jump to latest
        </button>
      )}

      <ChatComposer
        value={draft}
        onChange={onDraftChange}
        onSend={onSend}
        disabled={isTyping}
        placeholder="Continue the conversation…"
        hint="Enter to send · Shift+Enter for a new line"
      />
    </div>
  );
}

function ChatMessageRow({
  message,
  userInitials,
  isLatest,
}: {
  message: CoachMessage;
  userInitials: string;
  isLatest?: boolean;
}) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "group flex gap-3 animate-in",
        isUser && "flex-row-reverse",
        isLatest && "scroll-mt-24"
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
          isUser
            ? "bg-elevated text-foreground ring-1 ring-inset ring-border"
            : "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-900/30"
        )}
        aria-hidden
      >
        {isUser ? userInitials : "C"}
      </span>

      <div className="min-w-0 max-w-[min(100%,38rem)]">
        <div
          className={cn(
            "px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-2xl rounded-tr-md bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md shadow-brand-900/25"
              : "rounded-2xl rounded-tl-md border border-border/70 bg-surface/90 text-muted ring-1 ring-inset ring-white/[0.03]"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-white">{message.content}</p>
          ) : (
            <div className="[&_strong]:text-foreground">
              <CoachMarkdown content={message.content} />
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-1.5 flex items-center gap-2 px-1",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-[11px] text-subtle opacity-0 transition-opacity group-hover:opacity-100">
            {time}
          </span>
          {!isUser && <CopyButton text={message.content} />}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          /* ignore */
        }
      }}
      className="rounded-md px-1.5 py-0.5 text-[11px] text-subtle opacity-0 transition-all hover:bg-white/5 hover:text-foreground group-hover:opacity-100"
      aria-label={copied ? "Copied" : "Copy message"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function TypingRow() {
  return (
    <div className="flex gap-3 animate-in">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-semibold text-white shadow-md shadow-brand-900/30">
        C
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border/70 bg-surface/90 px-4 py-3.5 ring-1 ring-inset ring-white/[0.03]">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
