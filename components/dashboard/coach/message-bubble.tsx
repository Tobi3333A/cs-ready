import { cn } from "@/lib/utils";
import type { CoachMessage } from "@/lib/coach/types";

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
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

function MessageContent({ content }: { content: string }) {
  const blocks = content.split("\n\n");

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^\d+\.\s/.test(l) || /^[-*]\s/.test(l) || l.trim() === "");

        if (isList && lines.some((l) => l.trim())) {
          const ordered = /^\d+\.\s/.test(lines.find((l) => l.trim()) ?? "");
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={cn(
                "space-y-1 pl-1",
                ordered ? "list-decimal pl-5" : "list-disc pl-5"
              )}
            >
              {lines
                .filter((l) => l.trim())
                .map((line, j) => {
                  const text = line.replace(/^(\d+\.|[-*])\s+/, "");
                  return (
                    <li key={j} className="text-[inherit]">
                      {formatInline(text)}
                    </li>
                  );
                })}
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

export function MessageBubble({
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
        "flex gap-3 animate-in",
        isUser && "flex-row-reverse",
        isLatest && "scroll-mt-24"
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
          isUser
            ? "bg-elevated text-foreground ring-1 ring-inset ring-border"
            : "bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/20"
        )}
        aria-hidden
      >
        {isUser ? userInitials : "🤖"}
      </span>

      <div
        className={cn(
          "group max-w-[min(100%,42rem)]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md shadow-brand-900/30"
              : "rounded-tl-md border border-border/80 bg-surface/90 text-muted ring-1 ring-inset ring-white/[0.03]"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-white">{message.content}</p>
          ) : (
            <div className="[&_strong]:text-foreground">
              <MessageContent content={message.content} />
            </div>
          )}
        </div>
        <p
          className={cn(
            "mt-1.5 px-1 text-[11px] text-subtle opacity-0 transition-opacity group-hover:opacity-100",
            isUser ? "text-right" : "text-left"
          )}
        >
          {time}
        </p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm text-white shadow-lg shadow-brand-600/20">
        🤖
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-border/80 bg-surface/90 px-4 py-3.5 ring-1 ring-inset ring-white/[0.03]">
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
