"use server";

import type { UIMessage } from "ai";
import { revalidatePath } from "next/cache";
import {
  createConversation,
  deleteConversation,
  loadChat,
} from "@/lib/coach/chat-store";
import type { CoachConversationSummary } from "@/lib/coach/types";
import { getUser } from "@/lib/supabase/getUser";

export async function createCoachConversation(): Promise<{
  ok: boolean;
  conversation?: CoachConversationSummary;
  message?: string;
}> {
  const user = await getUser();
  if (!user) return { ok: false, message: "You must be signed in" };

  try {
    const conversation = await createConversation(user.id);
    revalidatePath("/dashboard/coach");
    return { ok: true, conversation };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create conversation",
    };
  }
}

export async function deleteCoachConversation(conversationId: string): Promise<{
  ok: boolean;
  message?: string;
}> {
  const user = await getUser();
  if (!user) return { ok: false, message: "You must be signed in" };

  try {
    await deleteConversation(user.id, conversationId);
    revalidatePath("/dashboard/coach");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to delete conversation",
    };
  }
}

export async function getCoachMessages(conversationId: string): Promise<{
  ok: boolean;
  messages?: UIMessage[];
  message?: string;
}> {
  const user = await getUser();
  if (!user) return { ok: false, message: "You must be signed in" };

  try {
    const messages = await loadChat(user.id, conversationId);
    return { ok: true, messages };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to load messages",
    };
  }
}
