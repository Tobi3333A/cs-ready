"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/input";
import { integrations as seed, type Integration } from "@/lib/constants";
import {
  formatFileSize,
  isIntegrationProvided,
  type IntegrationRow,
  type IntegrationState,
  type IntegrationValue,
  rowToIntegrationState,
} from "@/lib/integrations";
import {
  clearIntegrationFile,
  clearIntegrationLink,
  saveIntegrationLink,
  uploadIntegrationFile,
} from "./actions";
import { cn } from "@/lib/utils";

function LinkIntegrationInput({
  integration,
  value,
  isSaving,
  onSave,
  onClear,
}: {
  integration: Integration;
  value: IntegrationValue | undefined;
  isSaving: boolean;
  onSave: (url: string) => void;
  onClear: () => void;
}) {
  const savedUrl = value?.type === "link" ? value.url : "";
  const [draft, setDraft] = useState(savedUrl);
  const hasSaved = savedUrl.trim().length > 0;
  const isDirty = draft.trim() !== savedUrl.trim();

  useEffect(() => {
    setDraft(savedUrl);
  }, [savedUrl]);

  return (
    <div className="mt-4 space-y-3">
      <Field label="Profile link" htmlFor={`${integration.key}-link`}>
        <Input
          id={`${integration.key}-link`}
          type="url"
          placeholder={integration.linkPlaceholder}
          value={draft}
          disabled={isSaving}
          onChange={(e) => setDraft(e.target.value)}
          leftIcon={
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M8.5 11.5a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95l-1 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.5 8.5a3.5 3.5 0 0 0-4.95 0l-2 2a3.5 3.5 0 0 0 4.95 4.95l1-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </Field>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          disabled={!draft.trim() || (!isDirty && hasSaved) || isSaving}
          onClick={() => onSave(draft.trim())}
        >
          {isSaving ? "Saving…" : hasSaved && !isDirty ? "Saved" : "Save link"}
        </Button>
        {hasSaved && (
          <Button size="sm" variant="outline" disabled={isSaving} onClick={onClear}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

function UploadIntegrationInput({
  integration,
  value,
  isSaving,
  onSelect,
  onClear,
}: {
  integration: Integration;
  value: IntegrationValue | undefined;
  isSaving: boolean;
  onSelect: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const saved =
    value?.type === "upload"
      ? { fileName: value.fileName, fileSize: value.fileSize }
      : undefined;

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div className="mt-4 space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={integration.acceptedTypes}
        className="sr-only"
        disabled={isSaving}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {saved ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-lg">
            📎
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{saved.fileName}</p>
            <p className="text-xs text-subtle">{formatFileSize(saved.fileSize)}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() => inputRef.current?.click()}
            >
              {isSaving ? "Uploading…" : "Replace"}
            </Button>
            <Button size="sm" variant="ghost" disabled={isSaving} onClick={onClear}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isSaving}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            dragOver
              ? "border-brand-400 bg-brand-500/10"
              : "border-border bg-surface-2/30 hover:border-border-strong hover:bg-surface-2/50",
          )}
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-xl ring-1 ring-inset ring-white/10">
            {isSaving ? "⏳" : "⬆️"}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isSaving ? (
                "Uploading…"
              ) : (
                <>
                  Drop a file here or <span className="text-brand-300">browse</span>
                </>
              )}
            </p>
            {integration.uploadHint && (
              <p className="mt-1 text-xs text-subtle">{integration.uploadHint}</p>
            )}
          </div>
        </button>
      )}
    </div>
  );
}

function IntegrationCard({
  integration,
  value,
  isSaving,
  onLinkSave,
  onLinkClear,
  onFileSelect,
  onFileClear,
}: {
  integration: Integration;
  value: IntegrationValue | undefined;
  isSaving: boolean;
  onLinkSave: (url: string) => void;
  onLinkClear: () => void;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}) {
  const provided = isIntegrationProvided(value);

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-xl ring-1 ring-inset ring-white/10">
            {integration.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{integration.name}</p>
              {provided && (
                <Badge tone="accent" dot>
                  Added
                </Badge>
              )}
            </div>
            {provided && value?.type === "link" && (
              <p className="mt-0.5 truncate text-xs text-subtle">{value.url}</p>
            )}
          </div>
        </div>
        <Badge tone="neutral">{integration.inputType === "link" ? "Link" : "Upload"}</Badge>
      </div>

      <p className="mt-3 text-sm text-muted">{integration.description}</p>

      {integration.inputType === "link" ? (
        <LinkIntegrationInput
          integration={integration}
          value={value}
          isSaving={isSaving}
          onSave={onLinkSave}
          onClear={onLinkClear}
        />
      ) : (
        <UploadIntegrationInput
          integration={integration}
          value={value}
          isSaving={isSaving}
          onSelect={onFileSelect}
          onClear={onFileClear}
        />
      )}
    </Card>
  );
}

export function IntegrationsGrid({ initialData }: { initialData: IntegrationRow | null }) {
  const [values, setValues] = useState<IntegrationState>(() => rowToIntegrationState(initialData));
  const [flash, setFlash] = useState<{ ok: boolean; message: string } | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const providedCount = seed.filter((it) => isIntegrationProvided(values[it.key])).length;

  const showFlash = (result: { ok: boolean; message?: string }) => {
    if (result.message) {
      setFlash({ ok: result.ok, message: result.message });
    }
  };

  const handleLinkSave = (key: string, url: string) => {
    setPendingKey(key);
    startTransition(async () => {
      const result = await saveIntegrationLink(key, url);
      if (result.ok) {
        setValues((prev) => ({ ...prev, [key]: { type: "link", url } }));
      }
      showFlash(result);
      setPendingKey(null);
    });
  };

  const handleLinkClear = (key: string) => {
    setPendingKey(key);
    startTransition(async () => {
      const result = await clearIntegrationLink(key);
      if (result.ok) {
        setValues((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
      showFlash(result);
      setPendingKey(null);
    });
  };

  const handleFileSelect = (key: string, file: File) => {
    setPendingKey(key);
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadIntegrationFile(key, formData);
      if (result.ok) {
        setValues((prev) => ({
          ...prev,
          [key]: { type: "upload", fileName: file.name, fileSize: file.size },
        }));
      }
      showFlash(result);
      setPendingKey(null);
    });
  };

  const handleFileClear = (key: string) => {
    setPendingKey(key);
    startTransition(async () => {
      const result = await clearIntegrationFile(key);
      if (result.ok) {
        setValues((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
      showFlash(result);
      setPendingKey(null);
    });
  };

  return (
    <div className="space-y-6">
      {flash && (
        <p
          className={cn(
            "rounded-xl border px-3.5 py-2.5 text-sm",
            flash.ok
              ? "border-success/30 bg-success/10 text-success"
              : "border-danger/30 bg-danger/10 text-danger",
          )}
        >
          {flash.message}
        </p>
      )}

      <Card className="bg-gradient-to-br from-brand-600/12 to-surface">
        <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-muted">Signal strength</p>
            <p className="text-xl font-semibold text-foreground">
              {providedCount} of {seed.length} sources added
            </p>
            <p className="mt-1 text-sm text-subtle">
              Links and uploads are saved to your account.
            </p>
          </div>
          <div className="flex -space-x-2">
            {seed
              .filter((i) => isIntegrationProvided(values[i.key]))
              .map((i) => (
                <span
                  key={i.key}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-base"
                  title={i.name}
                >
                  {i.icon}
                </span>
              ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {seed.map((it) => (
          <IntegrationCard
            key={it.key}
            integration={it}
            value={values[it.key]}
            isSaving={isPending && pendingKey === it.key}
            onLinkSave={(url) => handleLinkSave(it.key, url)}
            onLinkClear={() => handleLinkClear(it.key)}
            onFileSelect={(file) => handleFileSelect(it.key, file)}
            onFileClear={() => handleFileClear(it.key)}
          />
        ))}
      </div>
    </div>
  );
}
