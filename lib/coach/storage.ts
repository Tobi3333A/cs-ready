import type { CoachConversation, CoachMessage } from "./types";

const STORAGE_KEY = "cs-ready-coach-conversations";

function isBrowser() {
  return typeof window !== "undefined";
}

function parseStored(raw: string | null): CoachConversation[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as CoachConversation[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function loadConversations(): CoachConversation[] {
  if (!isBrowser()) return [];
  return parseStored(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function saveConversations(conversations: CoachConversation[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function titleFromMessage(content: string): string {
  const clean = content.trim().replace(/\s+/g, " ");
  if (!clean) return "New conversation";
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}

export function createConversation(seed?: Partial<CoachConversation>): CoachConversation {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    messages: [],
    createdAt: now,
    updatedAt: now,
    ...seed,
  };
}

export function createMessage(
  role: CoachMessage["role"],
  content: string
): CoachMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}
