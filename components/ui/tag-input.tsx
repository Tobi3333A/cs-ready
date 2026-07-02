"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  suggestions = [],
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  const add = (tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    if (value.some((v) => v.toLowerCase() === clean.toLowerCase())) return;
    onChange([...value, clean]);
    setDraft("");
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  const remaining = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-2/60 p-2.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/25">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/15 px-2.5 py-1 text-sm font-medium text-brand-200 ring-1 ring-inset ring-brand-500/25"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="text-brand-300/70 transition-colors hover:text-white"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-sm text-foreground placeholder:text-subtle focus:outline-none"
        />
      </div>

      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {remaining.slice(0, 10).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className={cn(
                "rounded-lg border border-border px-2.5 py-1 text-xs text-muted transition-colors",
                "hover:border-brand-400/60 hover:text-foreground"
              )}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
