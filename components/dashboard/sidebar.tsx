"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { user } from "@/lib/mock-data";

const nav = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: "🗺️" },
  { href: "/dashboard/coach", label: "AI Coach", icon: "🤖" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "🔗" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-surface/40 lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-500/15 text-foreground ring-1 ring-inset ring-brand-500/25"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="mb-3 rounded-xl border border-brand-500/25 bg-gradient-to-br from-brand-500/15 to-accent-500/10 p-4">
          <p className="text-sm font-medium text-foreground">Boost your score</p>
          <p className="mt-1 text-xs text-muted">
            You&apos;re 13 points from Standout. See what&apos;s next.
          </p>
          <Link
            href="/dashboard/roadmap"
            className="mt-3 inline-block text-xs font-semibold text-brand-300 hover:text-brand-200"
          >
            View roadmap →
          </Link>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-semibold text-white">
            {user.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
