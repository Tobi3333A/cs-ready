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

/** Load all conversations from local storage. Swap for API fetch when backend ships. */
export function loadConversations(): CoachConversation[] {
  if (!isBrowser()) return [];
  return parseStored(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/** Persist the full conversation list. Swap for API sync when backend ships. */
export function saveConversations(conversations: CoachConversation[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function createConversationId(): string {
  return crypto.randomUUID();
}

export function createMessageId(): string {
  return crypto.randomUUID();
}

export function titleFromMessage(content: string): string {
  const clean = content.trim().replace(/\s+/g, " ");
  if (!clean) return "New conversation";
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}

export function createConversation(seed?: Partial<CoachConversation>): CoachConversation {
  const now = new Date().toISOString();
  return {
    id: createConversationId(),
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
    id: createMessageId(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}
