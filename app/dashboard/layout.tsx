import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect('/login');
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
