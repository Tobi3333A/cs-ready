"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { SocialButtons } from "@/components/ui/social-buttons";
import { login } from "./actions";

export function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error");
  const [state, formAction, pending] = useActionState(login, {});

  const errorMessage =
    state.error ??
    (authError === "auth" ? "Authentication failed. Please try again." : undefined);

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

      <form className="space-y-4" action={formAction}>
        <input type="hidden" name="next" value={next} />

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            leftIcon={<span>@</span>}
            required
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
            required
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border bg-surface-2 accent-brand-500"
          />
          Keep me logged in
        </label>

        {errorMessage && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {errorMessage}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
          {!pending && <span aria-hidden>→</span>}
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
