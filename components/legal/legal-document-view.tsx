import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_EFFECTIVE_DATE,
  processorPolicyLinks,
  type LegalDocument,
} from "@/lib/legal";

export function LegalDocumentView({
  doc,
  showProcessors = false,
}: {
  doc: LegalDocument;
  showProcessors?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Logo />
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-sm text-subtle">Effective {LEGAL_EFFECTIVE_DATE}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {doc.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{doc.summary}</p>

        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted md:text-[15px]">
                {section.blocks.map((block, i) =>
                  block.type === "p" ? (
                    <p key={i}>{block.text}</p>
                  ) : (
                    <ul key={i} className="list-disc space-y-2 pl-5">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}

          {showProcessors ? (
            <section id="processor-policies" className="scroll-mt-24">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Provider privacy policies
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
                For how our processors handle data, see their policies:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted md:text-[15px]">
                {processorPolicyLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline-offset-2 hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <p className="mt-14 border-t border-border/60 pt-6 text-sm text-subtle">
          Contact:{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="text-muted underline-offset-2 hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
        </p>      </main>
    </div>
  );
}
