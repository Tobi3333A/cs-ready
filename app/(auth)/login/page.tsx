import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { SocialButtons } from "@/components/ui/social-buttons";

export const metadata: Metadata = {
  title: "Log in · CS-Ready",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted">
          Log in to see your latest readiness score.
        </p>
      </div>

      <SocialButtons verb="Continue" />

      <div className="flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-border" />
        or with email
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* The backend/auth wiring is handled separately; this is UI only. */}
      <form className="space-y-4" action="/dashboard">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            leftIcon={<span>@</span>}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          hint={
            <Link href="#" className="text-brand-300 hover:text-brand-200">
              Forgot?
            </Link>
          }
        >
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border bg-surface-2 accent-brand-500"
          />
          Keep me logged in
        </label>

        <Button type="submit" size="lg" className="w-full">
          Log in
          <span aria-hidden>→</span>
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-brand-300 hover:text-brand-200">
          Create an account
        </Link>
      </p>
    </div>
  );
}
