"use server";

import { getUser } from "@/lib/supabase/getUser";
import { createClient } from "@/lib/supabase/server";
import {
  bucketForFile,
  FILE_KEYS,
  LINK_KEYS,
  type FileKey,
  type LinkKey,
  type StoredFile,
  parseStoredFile,
} from "@/lib/integrations";
import type { FormState } from "@/lib/types";
import { uploadFile } from "ai";
import { openai } from "@ai-sdk/openai";
import fs from "fs";

const MAX_BYTES = 10 * 1024 * 1024;

function isLinkKey(key: string): key is LinkKey {
  return (LINK_KEYS as readonly string[]).includes(key);
}

function isFileKey(key: string): key is FileKey {
  return (FILE_KEYS as readonly string[]).includes(key);
}

async function requireUser(): Promise<{ user: { id: string } } | FormState> {
  const user = await getUser();
  if (!user) return { ok: false, message: "You must be signed in" };
  return { user };
}

async function upsertLink(userId: string, key: LinkKey, value: string | null) {
  const supabase = await createClient();
  switch (key) {
    case "github":
      return supabase
        .from("integrations")
        .upsert({ user_id: userId, github: value }, { onConflict: "user_id" });
    case "leetcode":
      return supabase
        .from("integrations")
        .upsert({ user_id: userId, leetcode: value }, { onConflict: "user_id" });
    case "linkedin":
      return supabase
        .from("integrations")
        .upsert({ user_id: userId, linkedin: value }, { onConflict: "user_id" });
    case "portfolio":
      return supabase
        .from("integrations")
        .upsert({ user_id: userId, portfolio: value }, { onConflict: "user_id" });
  }
}

async function upsertFileMeta(userId: string, key: FileKey, value: StoredFile | null) {
  const supabase = await createClient();
  switch (key) {
    case "resume":
      return supabase
        .from("integrations")
        .upsert({ user_id: userId, resume: value }, { onConflict: "user_id" });
    case "transcript":
      return supabase
        .from("integrations")
        .upsert({ user_id: userId, transcript: value }, { onConflict: "user_id" });
  }
}

async function getStoredFile(userId: string, key: FileKey) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("integrations")
    .select("resume, transcript")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;
  return parseStoredFile(key === "resume" ? data.resume : data.transcript);
}

export async function saveIntegrationLink(key: string, url: string): Promise<FormState> {
  if (!isLinkKey(key)) return { ok: false, message: "Invalid integration" };

  const auth = await requireUser();
  if ("ok" in auth) return auth;

  const trimmed = url.trim();
  if (!trimmed) return { ok: false, message: "Please enter a link" };

  const { error } = await upsertLink(auth.user.id, key, trimmed);
  if (error) return { ok: false, message: "Could not save link" };
  return { ok: true, message: "Link saved" };
}

export async function clearIntegrationLink(key: string): Promise<FormState> {
  if (!isLinkKey(key)) return { ok: false, message: "Invalid integration" };

  const auth = await requireUser();
  if ("ok" in auth) return auth;

  const { error } = await upsertLink(auth.user.id, key, null);
  if (error) return { ok: false, message: "Could not remove link" };
  return { ok: true, message: "Link removed" };
}

export async function uploadIntegrationFile(key: string, formData: FormData): Promise<FormState> {
  if (!isFileKey(key)) return { ok: false, message: "Invalid integration" };

  const auth = await requireUser();
  if ("ok" in auth) return auth;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file selected" };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "File must be under 10 MB" };
  }

  const supabase = await createClient();
  const previous = await getStoredFile(auth.user.id, key);
  const bucket = bucketForFile(key);

  if (previous?.path) {
    await supabase.storage.from(bucket).remove([previous.path]);
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${auth.user.id}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (uploadError) return { ok: false, message: "Upload failed" };

  async function readBlobBytes(blob: Blob): Promise<Uint8Array> {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (!bytes.length) {
      throw new Error('File is empty.');
    }
    return bytes;
  }

  const { providerReference } = await uploadFile({
    api: openai,
    data: await readBlobBytes(file),
    filename: file.name,
  })

  const meta: StoredFile = {
    path,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    providerReference: providerReference,
  };

  const { error } = await upsertFileMeta(auth.user.id, key, meta);
  if (error) {
    await supabase.storage.from(bucket).remove([path]);
    return { ok: false, message: "Could not save file" };
  }

  return { ok: true, message: "File uploaded" };
}

export async function clearIntegrationFile(key: string): Promise<FormState> {
  if (!isFileKey(key)) return { ok: false, message: "Invalid integration" };

  const auth = await requireUser();
  if ("ok" in auth) return auth;

  const supabase = await createClient();
  const previous = await getStoredFile(auth.user.id, key);
  const bucket = bucketForFile(key);

  if (previous?.path) {
    await supabase.storage.from(bucket).remove([previous.path]);
  }

  const { error } = await upsertFileMeta(auth.user.id, key, null);
  if (error) return { ok: false, message: "Could not remove file" };
  return { ok: true, message: "File removed" };
}
