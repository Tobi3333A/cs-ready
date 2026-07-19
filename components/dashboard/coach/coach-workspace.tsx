"use client";

import { useMemo, useState, useTransition } from "react";
import type { UIMessage } from "ai";
import {
  createCoachConversation,
  deleteCoachConversation,
  getCoachMessages,
} from "@/app/dashboard/coach/actions";
import { ChatComposer } from "@/components/dashboard/coach/chat-composer";
import { CoachChat } from "@/components/dashboard/coach/coach-chat";
import { CoachContextPanel } from "@/components/dashboard/coach/coach-context-panel";
import { CoachLanding } from "@/components/dashboard/coach/coach-landing";
import { ConversationSidebar } from "@/components/dashboard/coach/conversation-sidebar";
import { SidebarToggle } from "@/components/dashboard/sidebar";
import type {
  CoachConversationSummary,
  CoachProfileContext,
} from "@/lib/coach/types";

function sortConversations(list: CoachConversationSummary[]) {
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function CoachWorkspace({
  context,
  initialConversations,
  initialMessages,
  initialAutoSend = null,
}: {
  context: CoachProfileContext;
  initialConversations: CoachConversationSummary[];
  initialMessages: UIMessage[];
  initialAutoSend?: string | null;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(
    initialConversations[0]?.id ?? null
  );
  const [activeMessages, setActiveMessages] = useState<UIMessage[]>(
    initialAutoSend ? [] : initialMessages
  );
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [autoSendText, setAutoSendText] = useState<string | null>(initialAutoSend);
  /** Keeps chat view mounted after first send even once autoSendText clears. */
  const [forceChat, setForceChat] = useState(
    initialMessages.length > 0 || Boolean(initialAutoSend)
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );
  const showChat =
    Boolean(activeConversation) &&
    (activeMessages.length > 0 || Boolean(autoSendText) || forceChat);

  const handleConversationUpdated = (info: {
    id: string;
    title?: string;
    preview?: string;
  }) => {
    setConversations((prev) =>
      sortConversations(
        prev.map((c) =>
          c.id === info.id
            ? {
                ...c,
                title: info.title ?? c.title,
                preview: info.preview ?? c.preview,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      )
    );
  };

  const loadMessagesFor = (id: string) => {
    setMessagesLoading(true);
    setError(null);
    startTransition(async () => {
      const result = await getCoachMessages(id);
      if (!result.ok || !result.messages) {
        setError(result.message ?? "Failed to load messages");
        setActiveMessages([]);
        setForceChat(false);
      } else {
        setActiveMessages(result.messages);
        setForceChat(result.messages.length > 0);
      }
      setMessagesLoading(false);
    });
  };

  const handleNewConversation = () => {
    startTransition(async () => {
      setError(null);
      setAutoSendText(null);
      setForceChat(false);
      const result = await createCoachConversation();
      if (!result.ok || !result.conversation) {
        setError(result.message ?? "Failed to create conversation");
        return;
      }
      setConversations((prev) => [result.conversation!, ...prev]);
      setActiveId(result.conversation.id);
      setActiveMessages([]);
      setDraft("");
      setSidebarOpen(false);
    });
  };

  const handleDeleteConversation = (id: string) => {
    startTransition(async () => {
      setError(null);
      const result = await deleteCoachConversation(id);
      if (!result.ok) {
        setError(result.message ?? "Failed to delete conversation");
        return;
      }

      const next = conversations.filter((c) => c.id !== id);
      setConversations(next);

      if (activeId === id) {
        setAutoSendText(null);
        const nextId = next[0]?.id ?? null;
        setActiveId(nextId);
        if (nextId) {
          loadMessagesFor(nextId);
        } else {
          setActiveMessages([]);
          setForceChat(false);
        }
      }
    });
  };

  const startConversationWithMessage = (text: string) => {
    const clean = text.trim();
    if (!clean || pending) return;

    startTransition(async () => {
      setError(null);
      let conversationId = activeId;

      const current = conversations.find((c) => c.id === conversationId);
      const canReuse =
        conversationId &&
        current &&
        !current.preview &&
        current.title === "New conversation" &&
        activeMessages.length === 0 &&
        !forceChat;

      if (!canReuse) {
        const result = await createCoachConversation();
        if (!result.ok || !result.conversation) {
          setError(result.message ?? "Failed to create conversation");
          return;
        }
        setConversations((prev) => [result.conversation!, ...prev]);
        conversationId = result.conversation.id;
        setActiveId(conversationId);
        setActiveMessages([]);
      }

      setDraft("");
      setSidebarOpen(false);
      setForceChat(true);
      setAutoSendText(clean);
    });
  };

  const handleSelectConversation = (id: string) => {
    if (id === activeId) return;
    setAutoSendText(null);
    setForceChat(false);
    setActiveId(id);
    setActiveMessages([]);
    loadMessagesFor(id);
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col lg:h-screen">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-surface/40 px-4 py-3 backdrop-blur-md lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarToggle />
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border text-muted transition-colors hover:bg-white/5 hover:text-foreground lg:hidden"
            aria-label="Open conversations"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground">
              {activeConversation?.title ?? "AI Coach"}
            </h1>
            <p className="truncate text-xs text-subtle">
              {context.overallScore != null
                ? `${context.overallScore} readiness · ${context.levelLabel}`
                : "Connect your profile for personalized advice"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-accent-500/25 bg-accent-500/10 px-2.5 py-1 text-[10px] font-medium text-accent-400 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Profile-aware
          </span>
          <button
            type="button"
            onClick={handleNewConversation}
            disabled={pending}
            className="hidden h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground sm:inline-flex disabled:opacity-50"
          >
            <PlusIcon />
            New chat
          </button>
        </div>
      </header>

      {error && (
        <div className="border-b border-danger/30 bg-danger/10 px-4 py-2 text-center text-xs text-danger">
          {error}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-canvas/50">
          {messagesLoading && activeId && !autoSendText && !forceChat ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-brand-400" />
              Loading conversation…
            </div>
          ) : showChat && activeConversation ? (
            <CoachChat
              key={activeConversation.id}
              conversationId={activeConversation.id}
              conversationTitle={activeConversation.title}
              initialMessages={autoSendText ? [] : activeMessages}
              context={context}
              autoSendText={autoSendText}
              onAutoSendConsumed={() => setAutoSendText(null)}
              onConversationUpdated={handleConversationUpdated}
            />
          ) : (
            <>
              <CoachLanding context={context} />
              <ChatComposer
                value={draft}
                onChange={setDraft}
                onSend={() => startConversationWithMessage(draft)}
                disabled={pending}
                showSuggestions
                onSuggestion={(s) => startConversationWithMessage(s)}
                hint="Enter to send · Shift+Enter for new line · Conversations sync to your account"
              />
            </>
          )}
        </main>

        <CoachContextPanel context={context} />
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
