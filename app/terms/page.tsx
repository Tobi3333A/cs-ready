import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { termsOfService } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service — CS-Ready",
  description:
    "Terms of Service for CS-Ready, the AI readiness coach for CS students.",
};

export default function TermsPage() {
  return <LegalDocumentView doc={termsOfService} />;
}
