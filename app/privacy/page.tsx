import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { privacyPolicy } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — CS-Ready",
  description:
    "Privacy Policy for CS-Ready, covering account data, uploads, and AI processing.",
};

export default function PrivacyPage() {
  return <LegalDocumentView doc={privacyPolicy} showProcessors />;
}
