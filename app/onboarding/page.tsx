"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TagInput } from "@/components/ui/tag-input";
import { cn } from "@/lib/utils";
import { roleOptions, skillSuggestions } from "@/lib/mock-data";

type StepId = "about" | "goals" | "connect" | "materials" | "review";

const steps: { id: StepId; title: string; blurb: string }[] = [
  { id: "about", title: "About you", blurb: "The basics so we can tailor everything." },
  { id: "goals", title: "Your goals", blurb: "What roles are you aiming for?" },
  { id: "connect", title: "Connect accounts", blurb: "Give the AI real signals to work with." },
  { id: "materials", title: "Skills & resume", blurb: "Round out your profile." },
  { id: "review", title: "Review", blurb: "Confirm and generate your score." },
];

type FormState = {
  firstName: string;
  school: string;
  gradYear: string;
  status: string;
  roles: string[];
  experience: string;
  github: string;
  leetcode: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
  resumeName: string;
};

const initialState: FormState = {
  firstName: "",
  school: "",
  gradYear: "2026",
  status: "student",
  roles: [],
  experience: "some",
  github: "",
  leetcode: "",
  linkedin: "",
  portfolio: "",
  skills: [],
  resumeName: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);

  const step = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isLast = stepIndex === steps.length - 1;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const next = () => {
    if (isLast) {
      router.push("/dashboard");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Logo />
          <Button href="/dashboard" variant="ghost" size="sm">
            Skip for now
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Step {stepIndex + 1} of {steps.length} · {step.title}
            </span>
            <span className="text-subtle">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 hidden gap-2 sm:flex">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepIndex(i)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  i === stepIndex
                    ? "bg-brand-500/15 text-brand-200 ring-1 ring-inset ring-brand-500/30"
                    : i < stepIndex
                      ? "text-accent-400"
                      : "text-subtle hover:text-muted"
                )}
              >
                {i < stepIndex ? "✓ " : ""}
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <div key={step.id} className="animate-in">
            <h1 className="text-2xl font-bold tracking-tight">{step.title}</h1>
            <p className="mt-1.5 text-muted">{step.blurb}</p>

            <div className="mt-8">
              {step.id === "about" && (
                <div className="space-y-5">
                  <Field label="What should we call you?" htmlFor="firstName">
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder="Alex"
                    />
                  </Field>
                  <Field label="School / university" htmlFor="school">
                    <Input
                      id="school"
                      value={form.school}
                      onChange={(e) => update("school", e.target.value)}
                      placeholder="State University"
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Expected graduation" htmlFor="gradYear">
                      <Select
                        id="gradYear"
                        value={form.gradYear}
                        onChange={(e) => update("gradYear", e.target.value)}
                      >
                        {["2025", "2026", "2027", "2028", "2029"].map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="I'm looking for" htmlFor="status">
                      <Select
                        id="status"
                        value={form.status}
                        onChange={(e) => update("status", e.target.value)}
                      >
                        <option value="internship">An internship</option>
                        <option value="newgrad">A new-grad role</option>
                        <option value="student">Still exploring</option>
                      </Select>
                    </Field>
                  </div>
                </div>
              )}

              {step.id === "goals" && (
                <div className="space-y-6">
                  <Field
                    label="Target roles"
                    hint="Pick a few — you can change these later"
                  >
                    <TagInput
                      value={form.roles}
                      onChange={(roles) => update("roles", roles)}
                      suggestions={roleOptions}
                      placeholder="e.g. Software Engineer Intern"
                    />
                  </Field>

                  <Field label="How much experience do you have?">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { key: "none", label: "Just starting", desc: "No internships yet" },
                        { key: "some", label: "Some", desc: "Projects or 1 internship" },
                        { key: "lots", label: "Experienced", desc: "Multiple internships" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => update("experience", opt.key)}
                          className={cn(
                            "rounded-xl border p-4 text-left transition-all",
                            form.experience === opt.key
                              ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-500/20"
                              : "border-border hover:border-border-strong"
                          )}
                        >
                          <div className="font-medium text-foreground">{opt.label}</div>
                          <div className="mt-0.5 text-xs text-muted">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {step.id === "connect" && (
                <div className="space-y-4">
                  <p className="rounded-xl border border-border bg-surface-2/50 p-4 text-sm text-muted">
                    The more you connect, the sharper your readiness score. You can add
                    or remove sources anytime.
                  </p>
                  <ConnectRow icon="🐙" label="GitHub username" recommended>
                    <Input
                      value={form.github}
                      onChange={(e) => update("github", e.target.value)}
                      placeholder="alexchen"
                      leftIcon={<span>@</span>}
                    />
                  </ConnectRow>
                  <ConnectRow icon="🟠" label="LeetCode username" recommended>
                    <Input
                      value={form.leetcode}
                      onChange={(e) => update("leetcode", e.target.value)}
                      placeholder="alexchen"
                      leftIcon={<span>@</span>}
                    />
                  </ConnectRow>
                  <ConnectRow icon="💼" label="LinkedIn URL">
                    <Input
                      value={form.linkedin}
                      onChange={(e) => update("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/…"
                    />
                  </ConnectRow>
                  <ConnectRow icon="🌐" label="Portfolio / personal site">
                    <Input
                      value={form.portfolio}
                      onChange={(e) => update("portfolio", e.target.value)}
                      placeholder="alexchen.dev"
                    />
                  </ConnectRow>
                </div>
              )}

              {step.id === "materials" && (
                <div className="space-y-6">
                  <Field label="Resume">
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-2/40 px-6 py-10 text-center transition-colors hover:border-brand-400/60 hover:bg-surface-2/70">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-500/15 text-2xl">
                        📄
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {form.resumeName || "Drop your resume or click to upload"}
                      </span>
                      <span className="text-xs text-subtle">PDF or DOCX, up to 5MB</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          update("resumeName", e.target.files?.[0]?.name ?? "")
                        }
                      />
                    </label>
                  </Field>

                  <Field label="Key skills" hint="Add your strongest ones">
                    <TagInput
                      value={form.skills}
                      onChange={(skills) => update("skills", skills)}
                      suggestions={skillSuggestions}
                      placeholder="e.g. React, Python, SQL"
                    />
                  </Field>
                </div>
              )}

              {step.id === "review" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-surface/60 p-6">
                    <ReviewRow label="Name" value={form.firstName || "—"} />
                    <ReviewRow label="School" value={form.school || "—"} />
                    <ReviewRow label="Graduation" value={form.gradYear} />
                    <ReviewRow
                      label="Target roles"
                      value={
                        form.roles.length ? (
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {form.roles.map((r) => (
                              <Badge key={r} tone="brand">
                                {r}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "—"
                        )
                      }
                    />
                    <ReviewRow
                      label="Connected"
                      value={
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {form.github && <Badge tone="accent">GitHub</Badge>}
                          {form.leetcode && <Badge tone="accent">LeetCode</Badge>}
                          {form.linkedin && <Badge tone="accent">LinkedIn</Badge>}
                          {form.portfolio && <Badge tone="accent">Portfolio</Badge>}
                          {form.resumeName && <Badge tone="accent">Resume</Badge>}
                          {!form.github &&
                            !form.leetcode &&
                            !form.linkedin &&
                            !form.portfolio &&
                            !form.resumeName &&
                            "—"}
                        </div>
                      }
                    />
                    <ReviewRow
                      label="Skills"
                      value={form.skills.length ? form.skills.join(", ") : "—"}
                      last
                    />
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
                    <span className="text-xl">🤖</span>
                    <p className="text-sm text-muted">
                      When you finish, our AI will analyze your signals and generate your
                      personalized readiness score and roadmap.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Nav */}
            <div className="mt-10 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={back}
                className={cn(stepIndex === 0 && "invisible")}
              >
                ← Back
              </Button>
              <Button onClick={next} size="lg">
                {isLast ? "Generate my score" : "Continue"}
                <span aria-hidden>→</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ConnectRow({
  icon,
  label,
  recommended,
  children,
}: {
  icon: string;
  label: string;
  recommended?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {recommended && (
          <Badge tone="accent" className="ml-auto">
            Recommended
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  last,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3",
        !last && "border-b border-border/60"
      )}
    >
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
