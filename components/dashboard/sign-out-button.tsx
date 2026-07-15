"use client";

import { signOut } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-muted cursor-pointer">
        Sign out
      </Button>
    </form>
  );
}
