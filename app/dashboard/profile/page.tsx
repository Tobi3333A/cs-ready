import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata: Metadata = {
  title: "Profile · CS-Ready",
};

export default function ProfilePage() {
  return (
    <>
      <Topbar title="Profile" subtitle="Manage your details, target roles, and skills." />
      <div className="mx-auto w-full max-w-4xl p-5 lg:p-8">
        <ProfileForm />
      </div>
    </>
  );
}
