import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SidebarToggle } from "@/components/dashboard/sidebar";

export function Topbar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-border/60 glass">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <SidebarToggle />
          {/* Mobile logo link back home */}
          <Link
            href="/dashboard"
            className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white lg:hidden"
          >
            CS
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <Button href="/dashboard/coach" variant="secondary" size="sm">
            <span aria-hidden>🤖</span>
            <span className="hidden sm:inline">Ask the coach</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
