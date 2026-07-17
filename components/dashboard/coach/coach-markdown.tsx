import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Renders `**bold**` segments inside plain coach text. */
export function formatInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/** Lightweight block parser for assistant replies (paragraphs + lists). */
export function CoachMarkdown({ content }: { content: string }) {
  const blocks = content.split("\n\n");

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList =
          lines.every((l) => /^\d+\.\s/.test(l) || /^[-*]\s/.test(l) || l.trim() === "") &&
          lines.some((l) => l.trim());

        if (isList) {
          const ordered = /^\d+\.\s/.test(lines.find((l) => l.trim()) ?? "");
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={cn("space-y-1", ordered ? "list-decimal pl-5" : "list-disc pl-5")}
            >
              {lines
                .filter((l) => l.trim())
                .map((line, j) => (
                  <li key={j}>{formatInline(line.replace(/^(\d+\.|[-*])\s+/, ""))}</li>
                ))}
            </Tag>
          );
        }

        return (
          <p key={i} className="whitespace-pre-wrap">
            {formatInline(block)}
          </p>
        );
      })}
    </div>
  );
}
