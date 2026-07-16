"use client";

import type { ReactNode } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { GenerateRoadmapButton } from "./generateRoadmapButton";
import {
  RoadmapGenerateProvider,
  RoadmapGeneratingPanel,
  useRoadmapGenerate,
} from "./roadmap-generate";

function RoadmapShellInner({
  children,
  canGenerate,
  empty,
}: {
  children: ReactNode;
  canGenerate: boolean;
  empty?: boolean;
}) {
  const { loading, error, generate } = useRoadmapGenerate()!;

  if (loading || error) {
    return (
      <>
        <Topbar
          title="Your roadmap"
          subtitle="A personalized, week-by-week plan to reach Standout."
        />
        <RoadmapGeneratingPanel error={error} onRetry={generate} />
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Your roadmap"
        subtitle="A personalized, week-by-week plan to reach Standout."
        action={
          canGenerate ? (
            <GenerateRoadmapButton
              variant="outline"
              label={empty ? "Generate roadmap" : "Generate new roadmap"}
            />
          ) : undefined
        }
      />
      {children}
    </>
  );
}

export function RoadmapShell({
  children,
  canGenerate,
  empty = false,
}: {
  children: ReactNode;
  canGenerate: boolean;
  empty?: boolean;
}) {
  return (
    <RoadmapGenerateProvider>
      <RoadmapShellInner canGenerate={canGenerate} empty={empty}>
        {children}
      </RoadmapShellInner>
    </RoadmapGenerateProvider>
  );
}
