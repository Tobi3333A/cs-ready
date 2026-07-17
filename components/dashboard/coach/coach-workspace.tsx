"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatComposer } from "@/components/dashboard/coach/chat-composer";
import { CoachChat } from "@/components/dashboard/coach/coach-chat";
import { CoachContextPanel } from "@/components/dashboard/coach/coach-context-panel";
import { CoachLanding } from "@/components/dashboard/coach/coach-landing";
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

function sortConversations(list: CoachConversation[]) {
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function CoachWorkspace({ context }: { context: CoachProfileContext }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const [conversations, setConversations] = useState<CoachConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const conversationsRef = useRef(conversations);
  const activeIdRef = useRef(activeId);
  const isTypingRef = useRef(isTyping);
  const initialQuerySent = useRef(false);

  conversationsRef.current = conversations;
  activeIdRef.current = activeId;
  isTypingRef.current = isTyping;

  useEffect(() => {
    const stored = loadConversations();
    setConversations(stored);
    if (stored.length > 0) setActiveId(stored[0].id);
    setHydrated(true);
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );
  const hasMessages = Boolean(activeConversation?.messages.length);

  const persist = useCallback((next: CoachConversation[]) => {
    const sorted = sortConversations(next);
    conversationsRef.current = sorted;
    setConversations(sorted);
    saveConversations(sorted);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || isTypingRef.current) return;

      let list = conversationsRef.current;
      let convId = activeIdRef.current;

      if (!convId || !list.some((c) => c.id === convId)) {
        const fresh = createConversation();
        convId = fresh.id;
        list = [fresh, ...list];
        activeIdRef.current = convId;
        setActiveId(convId);
      }

      const userMessage = createMessage("user", clean);
      const now = new Date().toISOString();

      persist(
        list.map((c) =>
          c.id === convId
            ? {
                ...c,
                title: c.messages.length === 0 ? titleFromMessage(clean) : c.title,
                messages: [...c.messages, userMessage],
                updatedAt: now,
              }
            : c
        )
      );

      setDraft("");
      isTypingRef.current = true;
      setIsTyping(true);

      await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));

      const reply = createMessage("assistant", demoCoachReply(clean, context));
      persist(
        conversationsRef.current.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, reply],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );

      isTypingRef.current = false;
      setIsTyping(false);
    },
    [context, persist]
  );

  useEffect(() => {
    if (!hydrated || !initialQuery || initialQuerySent.current) return;
    initialQuerySent.current = true;
    void sendMessage(initialQuery);
  }, [hydrated, initialQuery, sendMessage]);

  const handleNewConversation = () => {
    const fresh = createConversation();
    persist([fresh, ...conversationsRef.current]);
    activeIdRef.current = fresh.id;
    setActiveId(fresh.id);
    setDraft("");
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    const next = conversationsRef.current.filter((c) => c.id !== id);
    persist(next);
    if (activeIdRef.current === id) {
      const nextId = next[0]?.id ?? null;
      activeIdRef.current = nextId;
      setActiveId(nextId);
    }
  };

  const handleSend = () => void sendMessage(draft);

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
          {hasMessages && activeConversation ? (
            <CoachChat
              conversation={activeConversation}
              context={context}
              draft={draft}
              onDraftChange={setDraft}
              onSend={handleSend}
              isTyping={isTyping}
            />
          ) : (
            <>
              <CoachLanding context={context} />
              <ChatComposer
                value={draft}
                onChange={setDraft}
                onSend={handleSend}
                disabled={isTyping}
                showSuggestions
                onSuggestion={(s) => void sendMessage(s)}
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
