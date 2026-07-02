import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { SocialButtons } from "@/components/ui/social-buttons";

export const metadata: Metadata = {
  title: "Create your account · CS-Ready",
};

export default function SignupPage() {
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

      {/* The backend/auth wiring is handled separately; this is UI only. */}
      <form className="space-y-4" action="/onboarding">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName">
            <Input id="firstName" name="firstName" placeholder="Alex" autoComplete="given-name" />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <Input id="lastName" name="lastName" placeholder="Chen" autoComplete="family-name" />
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
          />
        </Field>

        <Field label="Password" htmlFor="password" hint="8+ characters">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          Create account
          <span aria-hidden>→</span>
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
