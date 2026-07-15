"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(false);
  const isDisabled = disabled || loading;

  async function createReadiness() {
    if (isDisabled) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/readiness", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate readiness score");
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
      onClick={createReadiness}
      disabled={isDisabled}
      variant={variant}
      size={size}
    >
      {loading ? loadingLabel : label}
    </Button>
  );
}
