import type { UIMessage } from "ai";
import type { Json } from "@/supabase/types";
import { createClient } from "@/lib/supabase/server";
import type { CoachConversationSummary } from "@/lib/coach/types";
import { previewFromMessages, titleFromMessage, getMessageText } from "@/lib/coach/message-utils";

function toSummary(row: {
  id: string;
  title: string;
  preview: string;
  created_at: string;
  updated_at: string;
}): CoachConversationSummary {
  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToUIMessage(row: {
  id: string;
  role: string;
  parts: Json;
  metadata: Json | null;
}): UIMessage {
  return {
    id: row.id,
    role: row.role as UIMessage["role"],
    parts: (Array.isArray(row.parts) ? row.parts : []) as UIMessage["parts"],
    ...(row.metadata != null ? { metadata: row.metadata as UIMessage["metadata"] } : {}),
  };
}

export async function listConversations(
  userId: string
): Promise<CoachConversationSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coach_conversations")
    .select("id, title, preview, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toSummary);
}

export async function createConversation(userId: string): Promise<CoachConversationSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coach_conversations")
    .insert({ user_id: userId, title: "New conversation", preview: "" })
    .select("id, title, preview, created_at, updated_at")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create conversation");
  return toSummary(data);
}

export async function deleteConversation(
  userId: string,
  conversationId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("coach_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function loadChat(
  userId: string,
  conversationId: string
): Promise<UIMessage[]> {
  const supabase = await createClient();

  const { data: conversation, error: convErr } = await supabase
    .from("coach_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (convErr) throw new Error(convErr.message);
  if (!conversation) throw new Error("Conversation not found");

  const { data, error } = await supabase
    .from("coach_messages")
    .select("id, role, parts, metadata")
    .eq("conversation_id", conversationId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToUIMessage);
}

export async function saveChat({
  userId,
  chatId,
  messages,
}: {
  userId: string;
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const supabase = await createClient();

  const { data: conversation, error: convErr } = await supabase
    .from("coach_conversations")
    .select("id, title")
    .eq("id", chatId)
    .eq("user_id", userId)
    .maybeSingle();

  if (convErr) throw new Error(convErr.message);
  if (!conversation) throw new Error("Conversation not found");

  const firstUser = messages.find((m) => m.role === "user");
  const nextTitle =
    conversation.title === "New conversation" && firstUser
      ? titleFromMessage(getMessageText(firstUser))
      : conversation.title;

  const { error: deleteErr } = await supabase
    .from("coach_messages")
    .delete()
    .eq("conversation_id", chatId);

  if (deleteErr) throw new Error(deleteErr.message);

  if (messages.length > 0) {
    const rows = messages.map((message, index) => ({
      id: message.id,
      conversation_id: chatId,
      role: message.role,
      parts: message.parts as unknown as Json,
      metadata: (message.metadata as Json | undefined) ?? null,
      sort_order: index,
    }));

    const { error: insertErr } = await supabase.from("coach_messages").insert(rows);
    if (insertErr) throw new Error(insertErr.message);
  }

  const { error: updateErr } = await supabase
    .from("coach_conversations")
    .update({
      title: nextTitle,
      preview: previewFromMessages(messages),
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId)
    .eq("user_id", userId);

  if (updateErr) throw new Error(updateErr.message);
}

export async function assertConversationOwner(
  userId: string,
  conversationId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coach_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}
