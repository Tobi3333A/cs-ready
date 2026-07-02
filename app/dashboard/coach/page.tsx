import type { Metadata } from "next";
import { Topbar } from "@/components/dashboard/topbar";
import { CoachChat } from "@/components/dashboard/coach-chat";

export const metadata: Metadata = {
  title: "AI Coach · CS-Ready",
};

export default function CoachPage() {
  return (
    <>
      <Topbar
        title="AI Coach"
        subtitle="Personalized guidance based on your connected profile."
      />
      <CoachChat />
    </>
  );
}
