"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRoadmapGenerate } from "./roadmap-generate";

export function GenerateRoadmapButton({
  variant = "primary",
  size = "sm",
  disabled = false,
  label = "Generate new roadmap",
}: {
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const shared = useRoadmapGenerate();
  const [localLoading, setLocalLoading] = useState(false);

  const loading = shared?.loading ?? localLoading;
  const isDisabled = disabled || loading;

  async function createRoadmap() {
    if (isDisabled) return;

    if (shared) {
      await shared.generate();
      return;
    }

    setLocalLoading(true);
    try {
      const res = await fetch("/api/ai/roadmap", { method: "POST" });
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
      } | null;

      if (!res.ok || data?.error || !data?.success) {
        throw new Error(data?.error ?? "Failed to generate roadmap");
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
      onClick={createRoadmap}
      disabled={isDisabled}
      title={
        disabled
          ? "Finish your current roadmap before generating a new one"
          : undefined
      }
      variant={variant}
      size={size}
    >
      {loading ? "Generating..." : label}
    </Button>
  );
}
