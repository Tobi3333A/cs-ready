"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COACH_SUGGESTIONS } from "@/lib/coach/constants";

export function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
  showSuggestions,
  onSuggestion,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  showSuggestions?: boolean;
  onSuggestion: (text: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  return (
    <div className="border-t border-border/60 bg-canvas/80 p-4 backdrop-blur-md lg:px-6">
      {showSuggestions && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {COACH_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestion(s)}
              className="shrink-0 rounded-full border border-border bg-surface/80 px-3.5 py-2 text-xs text-muted transition-colors hover:border-brand-400/50 hover:bg-brand-500/10 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border bg-surface-2/70 p-2 shadow-lg shadow-black/10 transition-all",
          "focus-within:border-brand-400/60 focus-within:ring-2 focus-within:ring-brand-500/20"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything about readiness, interviews, or your roadmap…"
          rows={1}
          disabled={disabled}
          className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-subtle focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          size="sm"
          disabled={disabled || !value.trim()}
          className="shrink-0"
          aria-label="Send message"
        >
          <SendIcon />
        </Button>
      </form>

      <p className="mt-2.5 text-center text-[11px] text-subtle">
        Enter to send · Shift+Enter for new line · Conversations save on this device until your account syncs
      </p>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M14.5 1.5L7 9M14.5 1.5L10 14.5L7 9M14.5 1.5L1.5 6L7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
