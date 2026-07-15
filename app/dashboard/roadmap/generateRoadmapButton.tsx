"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenerateRoadmapButton({
  variant = "primary",
  size = "sm",
  disabled = false,
}: {
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isDisabled = disabled || loading;

  async function createRoadmap() {
    if (isDisabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/roadmap", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate roadmap");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className="cursor-pointer"
      onClick={createRoadmap}
      disabled={isDisabled}
      title={disabled ? "Finish your current roadmap before generating a new one" : undefined}
      variant={variant}
      size={size}
    >
      {loading ? "Generating..." : "Generate new roadmap"}
    </Button>
  );
}