import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { IntegrationsGrid } from "@/app/dashboard/integrations/IntegrationsClient";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Integrations · CS-Ready",
};

export default async function IntegrationsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: integrations, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <>
      <Topbar
        title="Integrations"
        subtitle="Add profile links or upload documents so the AI has the full picture."
      />
      <div className="mx-auto w-full max-w-4xl p-5 lg:p-8">
        {error ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            Could not load your integrations. Please try again.
          </p>
        ) : (
          <IntegrationsGrid initialData={integrations} />
        )}
      </div>
    </>
  );
}
