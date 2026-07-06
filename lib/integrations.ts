import type { Tables } from "@/supabase/types";

export type IntegrationRow = Tables<"integrations">;

export type StoredFile = {
  path: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export const LINK_KEYS = ["github", "leetcode", "linkedin", "portfolio"] as const;
export const FILE_KEYS = ["resume", "transcript"] as const;

export type LinkKey = (typeof LINK_KEYS)[number];
export type FileKey = (typeof FILE_KEYS)[number];

export const FILE_BUCKETS: Record<FileKey, string> = {
  resume: "resumes",
  transcript: "transcripts",
};

export function bucketForFile(key: FileKey) {
  return FILE_BUCKETS[key];
}

export type IntegrationValue =
  | { type: "link"; url: string }
  | { type: "upload"; fileName: string; fileSize: number; path?: string };

export type IntegrationState = Record<string, IntegrationValue | undefined>;

export function parseStoredFile(value: unknown): StoredFile | null {
  if (!value || typeof value !== "object") return null;
  const file = value as Record<string, unknown>;
  if (
    typeof file.path !== "string" ||
    typeof file.fileName !== "string" ||
    typeof file.fileSize !== "number"
  ) {
    return null;
  }
  return {
    path: file.path,
    fileName: file.fileName,
    fileSize: file.fileSize,
    mimeType: typeof file.mimeType === "string" ? file.mimeType : "",
  };
}

export function rowToIntegrationState(row: IntegrationRow | null): IntegrationState {
  if (!row) return {};

  const state: IntegrationState = {};

  for (const key of LINK_KEYS) {
    const url = row[key];
    if (typeof url === "string" && url.trim()) {
      state[key] = { type: "link", url };
    }
  }

  for (const key of FILE_KEYS) {
    const file = parseStoredFile(row[key]);
    if (file) {
      state[key] = {
        type: "upload",
        fileName: file.fileName,
        fileSize: file.fileSize,
        path: file.path,
      };
    }
  }

  return state;
}

export function isIntegrationProvided(value: IntegrationValue | undefined) {
  if (!value) return false;
  if (value.type === "link") return value.url.trim().length > 0;
  return value.fileName.length > 0;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
