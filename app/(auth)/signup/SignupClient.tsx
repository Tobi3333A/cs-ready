"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { SocialButtons } from "@/components/ui/social-buttons";
import { signup } from "./actions";

export function SignupClient() {
  const [state, formAction, pending] = useActionState(signup, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted">
          Start measuring your internship &amp; job readiness today.
        </p>
      </div>

      <SocialButtons verb="Sign up" />

      <div className="flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-border" />
        or with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-4" action={formAction}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName">
            <Input
              id="firstName"
              name="firstName"
              placeholder="Alex"
              autoComplete="given-name"
              required
            />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <Input
              id="lastName"
              name="lastName"
              placeholder="Chen"
              autoComplete="family-name"
              required
            />
          </Field>
        </div>

        <Field label="School email" htmlFor="email" hint="Use your .edu if you have one">
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

        <Field label="Grade" htmlFor="grade">
          <Select id="grade" name="grade" defaultValue="Freshman">
            <option>Freshman</option>
            <option>Sophomore</option>
            <option>Junior</option>
            <option>Senior</option>
          </Select>
        </Field>

        <Field label="Password" htmlFor="password" hint="8+ characters">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>

        {state.error && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
          {!pending && <span aria-hidden>→</span>}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-300 hover:text-brand-200">
          Log in
        </Link>
      </p>
    </div>
  );
}
