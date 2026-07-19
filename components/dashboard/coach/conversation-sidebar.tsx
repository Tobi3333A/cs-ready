"use client";

import { cn } from "@/lib/utils";
import type { CoachConversationSummary } from "@/lib/coach/types";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  open,
  onClose,
}: {
  conversations: CoachConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close conversation list"
        />
      )}

      <aside
        className={cn(
          "flex w-[min(100vw-3rem,18rem)] shrink-0 flex-col border-r border-border/60 bg-surface/60 backdrop-blur-md",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Conversations</p>
            <p className="text-xs text-subtle">{conversations.length} saved</p>
          </div>
          <button
            type="button"
            onClick={onNew}
            className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-inset ring-brand-500/25 transition-colors hover:bg-brand-500/25 hover:text-brand-200"
            aria-label="New conversation"
            title="New conversation"
          >
            <PlusIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-subtle">
              Start a conversation — it&apos;ll appear here.
            </p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((c) => {
                const active = c.id === activeId;
                return (
                  <li key={c.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(c.id);
                        onClose?.();
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-brand-500/15 ring-1 ring-inset ring-brand-500/25"
                          : "hover:bg-white/5"
                      )}
                    >
                      <p className="truncate text-sm font-medium text-foreground">
                        {c.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-subtle">
                        {c.preview || "No messages yet"}
                      </p>
                      <p className="mt-1 text-[10px] text-subtle">
                        {formatRelativeTime(c.updatedAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg text-subtle opacity-0 transition-all hover:bg-danger/15 hover:text-danger group-hover:opacity-100"
                      aria-label={`Delete ${c.title}`}
                    >
                      <TrashIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 3.5V14.5M3.5 9H14.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 4h9M5.5 4V3a1 1 0 011-1h1a1 1 0 011 1v1m1.5 0v7.5a1 1 0 01-1 1h-4a1 1 0 01-1-1V4h6z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
