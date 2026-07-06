import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { ProfileForm } from "@/app/dashboard/profile/ProfileClient";
import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile · CS-Ready",
};

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const supabase = await createClient();

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
    if (profileErr) {
      console.error(profileErr.message);
      return;
    }

  return (
    <>
      <Topbar title="Profile" subtitle="Manage your details, target roles, and skills." />
      <div className="mx-auto w-full max-w-4xl p-5 lg:p-8">
        <ProfileForm user={profile} />
      </div>
    </>
  );
}
