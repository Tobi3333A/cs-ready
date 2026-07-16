"use client";

import type { ReactNode } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { GenerateReadinessButton } from "./generateReadinessButton";
import {
  ReadinessGenerateProvider,
  ReadinessGeneratingPanel,
  useReadinessGenerate,
} from "./readiness-generate";

function DashboardShellInner({
  children,
  title,
  subtitle,
  showReanalyze = false,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  showReanalyze?: boolean;
}) {
  const { loading, error, generate } = useReadinessGenerate()!;

  if (loading || error) {
    return (
      <>
        <Topbar title={title} subtitle="Analyzing your internship readiness…" />
        <ReadinessGeneratingPanel error={error} onRetry={generate} />
      </>
    );
  }

  return (
    <>
      <Topbar
        title={title}
        subtitle={subtitle}
        action={
          showReanalyze ? (
            <GenerateReadinessButton
              variant="ghost"
              size="sm"
              label="Re-analyze"
              loadingLabel="Re-analyzing..."
            />
          ) : undefined
        }
      />
      {children}
    </>
  );
}

export function DashboardShell({
  children,
  title,
  subtitle,
  showReanalyze = false,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  showReanalyze?: boolean;
}) {
  return (
    <ReadinessGenerateProvider>
      <DashboardShellInner
        title={title}
        subtitle={subtitle}
        showReanalyze={showReanalyze}
      >
        {children}
      </DashboardShellInner>
    </ReadinessGenerateProvider>
  );
}
