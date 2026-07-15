import { DashboardShell } from "@/components/dashboard/sidebar";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
