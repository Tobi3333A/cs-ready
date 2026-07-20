import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { Progress } from "@/components/ui/progress";

const features = [
  {
    icon: "🧭",
    title: "Readiness Score",
    body: "One honest number, backed by a full breakdown across DSA, projects, system design, and more.",
  },
  {
    icon: "🔗",
    title: "Connect everything",
    body: "GitHub, LeetCode, resume, LinkedIn, and your portfolio — the AI reads the same signals recruiters do.",
  },
  {
    icon: "🤖",
    title: "AI that's specific",
    body: "No generic advice. Get targeted actions ranked by the impact they'll have on your offers.",
  },
  {
    icon: "🗺️",
    title: "Personalized roadmap",
    body: "A week-by-week plan tailored to your target roles and where your gaps actually are.",
  },
  {
    icon: "🎯",
    title: "Role matching",
    body: "See how well you fit SWE, ML, data, and more — and what it takes to close the gap.",
  },
  {
    icon: "📈",
    title: "Track momentum",
    body: "Watch your score climb as you ship projects, solve problems, and sharpen your resume.",
  },
];

const steps = [
  {
    n: "01",
    title: "Create your profile",
    body: "Tell us your target roles, graduation year, and where you are today.",
  },
  {
    n: "02",
    title: "Connect your signals",
    body: "Link GitHub, LeetCode, and drop in your resume so the AI has real context.",
  },
  {
    n: "03",
    title: "Get your readiness score",
    body: "See a full breakdown of strengths and gaps against your target roles.",
  },
  {
    n: "04",
    title: "Follow your roadmap",
    body: "Work through ranked, high-impact actions and watch your score rise.",
  },
];

const roles = [
  { title: "Software Engineer", match: 78, tone: "info" as const },
  { title: "Full-Stack New Grad", match: 74, tone: "brand" as const },
  { title: "Machine Learning", match: 61, tone: "warning" as const },
  { title: "Data Scientist", match: 66, tone: "info" as const },
  { title: "DevOps / Platform", match: 58, tone: "warning" as const },
  { title: "Mobile Engineer", match: 71, tone: "brand" as const },
];

const faqs = [
  {
    q: "Is my data private?",
    a: "You control every connection. Your profile is yours — disconnect any source at any time.",
  },
  {
    q: "Which roles does it support?",
    a: "SWE, full-stack, frontend, backend, ML, data, DevOps, mobile, security, and more.",
  },
  {
    q: "Do I need experience already?",
    a: "No. CS-Ready meets you wherever you are and builds a plan from there — first internship or new grad.",
  },
  {
    q: "How is the score calculated?",
    a: "The AI weighs signals from your code, problem-solving, projects, and resume against your target roles.",
  },
];

const previewCategories = [
  { label: "Data Structures & Algorithms", score: 68 },
  { label: "Projects & Portfolio", score: 81 },
  { label: "System Design", score: 52 },
  { label: "Resume & Experience", score: 77 },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div className="animate-in">
              <Badge tone="accent" dot className="mb-5">
                AI-powered readiness for CS students
              </Badge>
              <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Know if you&apos;re{" "}
                <span className="text-gradient">actually ready</span> for that
                internship.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted">
                Connect your GitHub, LeetCode, and resume. CS-Ready reads the same
                signals recruiters do and gives you one honest score — plus the exact
                steps to raise it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/dashboard" size="lg">
                  Go to dashboard
                  <span aria-hidden>→</span>
                </Button>
                <Button href="/signup" variant="outline" size="lg">
                  Sign up
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-subtle">
                <span className="flex items-center gap-2">
                  <span className="text-accent-400">✓</span> Free to start
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-accent-400">✓</span> No credit card
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-accent-400">✓</span> Setup in 3 minutes
                </span>
              </div>
            </div>

            {/* Hero preview card */}
            <div className="animate-in [animation-delay:120ms]">
              <Card className="relative overflow-hidden p-6 shadow-2xl shadow-black/40">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Your readiness score</p>
                    <p className="text-xs text-subtle">for Software Engineer roles</p>
                  </div>
                  <Badge tone="info" dot>
                    Competitive
                  </Badge>
                </div>
                <div className="my-4 flex justify-center">
                  <ScoreRing value={72} label="Competitive" sublabel="Top 30% of applicants" />
                </div>
                <div className="space-y-3">
                  {previewCategories.map((c) => (
                    <div key={c.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">{c.label}</span>
                        <span className="font-medium tabular-nums text-foreground">
                          {c.score}
                        </span>
                      </div>
                      <Progress value={c.score} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Social proof strip */}
        <section className="border-y border-border/60 bg-surface/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 text-center sm:grid-cols-4">
            {[
              { stat: "6", label: "signals analyzed" },
              { stat: "20+", label: "target roles" },
              { stat: "1", label: "clear score" },
              { stat: "∞", label: "actionable next steps" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-bold text-gradient">{item.stat}</div>
                <div className="mt-1 text-sm text-muted">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand" className="mb-4">
              Everything in one place
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built to make your prep <span className="text-gradient">measurable</span>
            </h2>
            <p className="mt-4 text-muted">
              Stop guessing whether you&apos;ve done enough. See it, track it, and know
              exactly what to do next.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} hover className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-xl ring-1 ring-inset ring-white/10">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-y border-border/60 bg-surface/30">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="accent" className="mb-4">
                How it works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From signup to a plan in <span className="text-gradient">minutes</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <Card key={s.n} className="relative p-6">
                  <span className="text-4xl font-bold text-white/10">{s.n}</span>
                  <h3 className="mt-2 text-base font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{s.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge tone="info" className="mb-4">
                Role matching
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                See how you stack up for the roles you{" "}
                <span className="text-gradient">actually want</span>
              </h2>
              <p className="mt-4 text-muted">
                Pick your targets and CS-Ready scores your fit for each one — then shows
                you the shortest path to a stronger match.
              </p>
              <Button href="/signup" className="mt-8">
                Match me to roles
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {roles.map((r) => (
                <Card key={r.title} hover className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{r.title}</h3>
                    <Badge tone={r.tone}>{r.match}% match</Badge>
                  </div>
                  <Progress value={r.match} className="mt-4" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border/60 bg-surface/30">
          <div className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
            <div className="text-center">
              <Badge tone="neutral" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Questions, answered
              </h2>
            </div>
            <div className="mt-12 space-y-4">
              {faqs.map((item) => (
                <Card key={item.q} className="p-6">
                  <h3 className="font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-sm text-muted">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <Card className="relative overflow-hidden border-brand-500/30 bg-gradient-to-br from-brand-600/20 via-surface to-accent-500/10 p-10 text-center lg:p-16">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Stop wondering if you&apos;re ready. Find out.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Get your readiness score and a personalized roadmap in the next three
                minutes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/signup" size="lg">
                  Get started free
                  <span aria-hidden>→</span>
                </Button>
                <Button href="/login" variant="outline" size="lg">
                  I already have an account
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
