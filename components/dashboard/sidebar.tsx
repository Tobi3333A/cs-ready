"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/lib/constants";
import { type User } from "@supabase/supabase-js";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { MobileNav } from "@/components/dashboard/mobile-nav";

const STORAGE_KEY = "cs-ready-dashboard-sidebar-open";

const nav = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: "🗺️" },
  { href: "/dashboard/coach", label: "AI Coach", icon: "🤖" },
  { href: "/dashboard/integrations", label: "Integrations", icon: "🔗" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within DashboardShell");
  }
  return ctx;
}

function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "0") setOpenState(false);
      else if (stored === "1") setOpenState(true);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setOpenState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ open: hydrated ? open : true, setOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-1">
        <Sidebar user={user} />
        <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">{children}</div>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}

export function SidebarToggle({ className }: { className?: string }) {
  const { open, toggle } = useSidebar();

  if (open) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "hidden h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-muted transition-colors hover:bg-white/5 hover:text-foreground lg:grid",
        className
      )}
      aria-label="Open sidebar"
      title="Open sidebar"
    >
      <PanelOpenIcon />
    </button>
  );
}

function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const { open, setOpen, toggle } = useSidebar();

  useEffect(() => {
    if (pathname.startsWith("/dashboard/coach")) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border/60 bg-surface/40 transition-[width] duration-300 ease-out lg:flex",
        open ? "w-64" : "w-0 border-r-0"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "flex h-full w-64 flex-col transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 px-4">
          <Logo />
          <button
            type="button"
            onClick={toggle}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <PanelCloseIcon />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={open ? undefined : -1}
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
              There&apos;s always ways to improve. See what&apos;s next.
            </p>
            <Link
              href="/dashboard/roadmap"
              tabIndex={open ? undefined : -1}
              className="mt-3 inline-block text-xs font-semibold text-brand-300 hover:text-brand-200"
            >
              View roadmap →
            </Link>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-semibold text-white">
              {getUserInitials(user.user_metadata.full_name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.user_metadata.full_name}
              </p>
              <p className="truncate text-xs text-subtle">{user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

function PanelCloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 3h8M2 8h8M2 13h8M13 4.5L10.5 8 13 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PanelOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 3h8M6 8h8M6 13h8M3 4.5L5.5 8 3 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
