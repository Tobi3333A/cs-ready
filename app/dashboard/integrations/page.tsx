import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { IntegrationsGrid } from "@/components/dashboard/integrations-grid";

export const metadata: Metadata = {
  title: "Integrations · CS-Ready",
};

export default function IntegrationsPage() {
  return (
    <>
      <Topbar
        title="Integrations"
        subtitle="Connect your accounts so the AI has the full picture."
      />
      <div className="mx-auto w-full max-w-4xl p-5 lg:p-8">
        <IntegrationsGrid />
      </div>
    </>
  );
}
