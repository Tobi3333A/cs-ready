import type { UIMessage } from "ai";

/** Extract plain text from an AI SDK UIMessage (parts-based). */
export function getMessageText(message: Pick<UIMessage, "parts">): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function titleFromMessage(content: string): string {
  const clean = content.trim().replace(/\s+/g, " ");
  if (!clean) return "New conversation";
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}

export function previewFromMessages(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    const text = getMessageText(lastUser).trim();
    if (text) return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  }
  const last = messages[messages.length - 1];
  if (!last) return "";
  const text = getMessageText(last).trim();
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}
