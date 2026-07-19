"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatComposer } from "@/components/dashboard/coach/chat-composer";
import { CoachMarkdown } from "@/components/dashboard/coach/coach-markdown";
import { getMessageText } from "@/lib/coach/message-utils";
import type { CoachProfileContext } from "@/lib/coach/types";
import { cn } from "@/lib/utils";

export function CoachChat({
  conversationId,
  conversationTitle,
  initialMessages,
  context,
  autoSendText,
  onAutoSendConsumed,
  onConversationUpdated,
}: {
  conversationId: string;
  conversationTitle: string;
  initialMessages: UIMessage[];
  context: CoachProfileContext;
  /** Optional text to send once on mount (landing composer / ?q= deep-link). */
  autoSendText?: string | null;
  onAutoSendConsumed?: () => void;
  onConversationUpdated?: (info: {
    id: string;
    title?: string;
    preview?: string;
  }) => void;
}) {
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [showJump, setShowJump] = useState(false);
  const autoSendRef = useRef(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        prepareSendMessagesRequest({ messages, id }) {
          return {
            body: {
              id,
              message: messages[messages.length - 1],
            },
          };
        },
      }),
    []
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
    onFinish: ({ messages: finalMessages }) => {
      const lastUser = [...finalMessages].reverse().find((m) => m.role === "user");
      const previewRaw = lastUser ? getMessageText(lastUser) : "";
      const preview = previewRaw
        ? previewRaw.length > 80
          ? `${previewRaw.slice(0, 80)}…`
          : previewRaw
        : undefined;

      let title: string | undefined;
      if (conversationTitle === "New conversation" && lastUser) {
        const clean = getMessageText(lastUser).trim().replace(/\s+/g, " ");
        if (clean) {
          title = clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
        }
      }

      onConversationUpdated?.({
        id: conversationId,
        title,
        preview,
      });
    },
  });

  const isBusy = status === "submitted" || status === "streaming";
  const showTyping = status === "submitted";

  useEffect(() => {
    if (!autoSendText?.trim() || autoSendRef.current) return;
    autoSendRef.current = true;
    void sendMessage({ text: autoSendText.trim() }).finally(() => {
      onAutoSendConsumed?.();
    });
  }, [autoSendText, onAutoSendConsumed, sendMessage]);

  useEffect(() => {
    if (!stickToBottom) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, stickToBottom]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setStickToBottom(nearBottom);
    setShowJump(!nearBottom && messages.length > 0);
  };

  const handleSend = () => {
    const clean = draft.trim();
    if (!clean || isBusy) return;
    clearError();
    void sendMessage({ text: clean });
    setDraft("");
  };

  const displayTitle =
    conversationTitle === "New conversation" && messages.length > 0
      ? (() => {
          const firstUser = messages.find((m) => m.role === "user");
          if (!firstUser) return conversationTitle;
          const clean = getMessageText(firstUser).trim().replace(/\s+/g, " ");
          if (!clean) return conversationTitle;
          return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
        })()
      : conversationTitle;

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
                {displayTitle}
              </p>
              <p className="mt-0.5 text-[11px] text-subtle">
                {messages.length} message{messages.length === 1 ? "" : "s"}
                {context.overallScore != null
                  ? ` · ${context.overallScore} · ${context.levelLabel}`
                  : ""}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent-500/20 bg-accent-500/10 px-2.5 py-1 text-[10px] font-medium text-accent-400">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-accent-400",
                  isBusy && "animate-pulse"
                )}
              />
              {isBusy ? "Thinking…" : "Live session"}
            </span>
          </div>

          {messages.map((message, i) => (
            <ChatMessageRow
              key={message.id}
              message={message}
              userInitials={context.initials}
              isLatest={i === messages.length - 1 && !showTyping}
            />
          ))}

          {showTyping && <TypingRow />}
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error.message || "Something went wrong. Try sending again."}
            </div>
          )}
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
        onChange={setDraft}
        onSend={handleSend}
        disabled={isBusy}
        placeholder="Continue the conversation…"
        hint="Enter to send · Shift+Enter for a new line · Saved to your account"
      />
    </div>
  );
}

function ChatMessageRow({
  message,
  userInitials,
  isLatest,
}: {
  message: UIMessage;
  userInitials: string;
  isLatest?: boolean;
}) {
  const isUser = message.role === "user";
  const text = getMessageText(message);

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
            <p className="whitespace-pre-wrap text-white">{text}</p>
          ) : (
            <div className="[&_strong]:text-foreground">
              <CoachMarkdown content={text} />
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-1.5 flex items-center gap-2 px-1",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          {!isUser && text && <CopyButton text={text} />}
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
