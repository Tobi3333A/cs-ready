"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function GenerateRoadmapButton({
  variant = "primary",
  size = "sm",
}: {
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createRoadmap() {
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
      disabled={loading}
      variant={variant}
      size={size}
    >
      {loading ? "Generating..." : "Generate new roadmap"}
    </Button>
  );
}