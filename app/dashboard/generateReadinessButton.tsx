"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useReadinessGenerate } from "./readiness-generate";

export function GenerateReadinessButton({
  variant = "primary",
  size = "sm",
  disabled = false,
  label = "Generate readiness score",
  loadingLabel = "Analyzing...",
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}) {
  const router = useRouter();
  const shared = useReadinessGenerate();
  const [localLoading, setLocalLoading] = useState(false);

  const loading = shared?.loading ?? localLoading;
  const isDisabled = disabled || loading;

  async function createReadiness() {
    if (isDisabled) return;

    if (shared) {
      await shared.generate();
      return;
    }

    setLocalLoading(true);
    try {
      const res = await fetch("/api/ai/readiness", { method: "POST" });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!res.ok || data?.error || !data?.success) {
        throw new Error(data?.error ?? "Failed to generate readiness score");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  }

  return (
    <Button
      className="cursor-pointer"
      onClick={createReadiness}
      disabled={isDisabled}
      variant={variant}
      size={size}
    >
      {loading ? loadingLabel : label}
    </Button>
  );
}
