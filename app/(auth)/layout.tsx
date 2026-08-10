import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      {/* Form side */}
      <div className="flex w-full flex-col px-5 py-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Logo />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          {children}
        </div>
        <div className="mx-auto w-full max-w-md text-center text-xs text-subtle">
          By continuing you agree to our{" "}
          <Link href="#" className="text-muted underline-offset-2 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-muted underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden border-l border-border/60 bg-surface/40 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl" />

        <div className="relative flex flex-col justify-center gap-8 p-12 xl:p-16">
          <div className="flex justify-center">
            <ScoreRing value={72} size={200} label="Competitive" sublabel="Your readiness" />
          </div>
          <div className="max-w-md">
            <Badge tone="accent" dot className="mb-4">
              Join other CS students
            </Badge>
            <h2 className="text-2xl font-bold leading-snug tracking-tight xl:text-3xl">
              Turn &ldquo;am I ready?&rdquo; into a number you can move.
            </h2>
            <p className="mt-4 text-muted">
              Connect your GitHub, LeetCode, and resume. Get a clear readiness score and a
              personalized plan to land the internship or job you want.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { k: "GitHub", v: "🐙" },
              { k: "LeetCode", v: "🟠" },
              { k: "Resume", v: "📄" },
            ].map((item) => (
              <div
                key={item.k}
                className="rounded-xl border border-border bg-surface/60 p-4 text-center"
              >
                <div className="text-2xl">{item.v}</div>
                <div className="mt-1 text-xs text-muted">{item.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
