"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatComposer } from "@/components/dashboard/coach/chat-composer";
import { ChatThread } from "@/components/dashboard/coach/chat-thread";
import { CoachContextPanel } from "@/components/dashboard/coach/coach-context-panel";
import { ConversationSidebar } from "@/components/dashboard/coach/conversation-sidebar";
import { SidebarToggle } from "@/components/dashboard/sidebar";
import { demoCoachReply } from "@/lib/coach/constants";
import {
  createConversation,
  createMessage,
  loadConversations,
  saveConversations,
  titleFromMessage,
} from "@/lib/coach/storage";
import type { CoachConversation, CoachProfileContext } from "@/lib/coach/types";

const TYPING_DELAY_MS = 900;

export function CoachWorkspace({ context }: { context: CoachProfileContext }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const [conversations, setConversations] = useState<CoachConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadConversations();
    setConversations(stored);
    if (stored.length > 0) {
      setActiveId(stored[0].id);
    }
    setHydrated(true);
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const persist = useCallback((next: CoachConversation[]) => {
    const sorted = [...next].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setConversations(sorted);
    saveConversations(sorted);
  }, []);

  const updateConversation = useCallback(
    (id: string, updater: (c: CoachConversation) => CoachConversation) => {
      persist(
        conversations.map((c) => (c.id === id ? updater(c) : c))
      );
    },
    [conversations, persist]
  );

  const ensureActiveConversation = useCallback((): string => {
    if (activeId && conversations.some((c) => c.id === activeId)) {
      return activeId;
    }
    const fresh = createConversation();
    persist([fresh, ...conversations]);
    setActiveId(fresh.id);
    return fresh.id;
  }, [activeId, conversations, persist]);

  const sendMessage = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || isTyping) return;

      const convId = ensureActiveConversation();
      const userMessage = createMessage("user", clean);
      const now = new Date().toISOString();

      updateConversation(convId, (c) => ({
        ...c,
        title: c.messages.length === 0 ? titleFromMessage(clean) : c.title,
        messages: [...c.messages, userMessage],
        updatedAt: now,
      }));

      setDraft("");
      setIsTyping(true);

      await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));

      const reply = createMessage("assistant", demoCoachReply(clean, context));
      const replyTime = new Date().toISOString();

      updateConversation(convId, (c) => ({
        ...c,
        messages: [...c.messages, reply],
        updatedAt: replyTime,
      }));

      setIsTyping(false);
    },
    [context, ensureActiveConversation, isTyping, updateConversation]
  );

  const initialQuerySent = useRef(false);

  useEffect(() => {
    if (!hydrated || !initialQuery || initialQuerySent.current) return;
    initialQuerySent.current = true;
    void sendMessage(initialQuery);
  }, [hydrated, initialQuery, sendMessage]);

  const handleNewConversation = () => {
    const fresh = createConversation();
    persist([fresh, ...conversations]);
    setActiveId(fresh.id);
    setDraft("");
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    const next = conversations.filter((c) => c.id !== id);
    persist(next);
    if (activeId === id) {
      setActiveId(next[0]?.id ?? null);
    }
  };

  const showSuggestions =
    !activeConversation || activeConversation.messages.length === 0;

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col lg:h-screen">
      {/* Coach header — replaces the standard dashboard Topbar on this page */}
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
            className="hidden h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground sm:inline-flex"
          >
            <PlusIcon />
            New chat
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-canvas/50">
          <ChatThread
            conversation={activeConversation}
            context={context}
            isTyping={isTyping}
          />
          <ChatComposer
            value={draft}
            onChange={setDraft}
            onSend={() => void sendMessage(draft)}
            disabled={isTyping}
            showSuggestions={showSuggestions}
            onSuggestion={(s) => void sendMessage(s)}
          />
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
