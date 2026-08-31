"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GitHubStarButton } from "@/components/marketing/github-star-button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#roles", label: "Roles" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-2 px-4 sm:px-5 md:gap-4">
          <Logo className="shrink-0" />

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <GitHubStarButton />
            <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button href="/signup" size="sm">
              Get started
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <Button href="/signup" size="sm">
              Get started
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col border-l border-border/60 bg-surface backdrop-blur-md transition-transform duration-300 md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
          <p className="text-sm font-semibold text-foreground">Menu</p>
          <button
            type="button"
            onClick={closeMenu}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto p-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-border/60 p-4">
          <Button href="/login" variant="ghost" size="sm" className="w-full" onClick={closeMenu}>
            Log in
          </Button>
          <GitHubStarButton className="w-full" />
        </div>
      </aside>
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 5h12M3 9h12M3 13h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M5 5l8 8M13 5l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
