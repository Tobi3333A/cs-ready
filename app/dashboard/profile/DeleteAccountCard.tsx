"use client";

import { useState, useTransition } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { deleteAccount } from "./actions";

const REMOVAL_ITEMS = [
  "Your profile and account credentials",
  "Connected links and uploaded resume/transcript files",
  "Readiness scores and personalized roadmap",
  "AI coach conversations",
] as const;

export function DeleteAccountCard({ email }: { email: string }) {
  const [confirming, setConfirming] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const emailMatches =
    confirmEmail.trim().toLowerCase() === email.trim().toLowerCase();

  const handleCancel = () => {
    setConfirming(false);
    setConfirmEmail("");
    setError(null);
  };

  const handleDelete = () => {
    if (!emailMatches || isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount();
      if (result && !result.ok) {
        setError(result.message ?? "Could not delete account");
      }
    });
  };

  return (
    <Card className="border-danger/30">
      <CardHeader
        title="Danger zone"
        description="Permanently delete your account and the data we control in CS-Ready."
      />
      <CardBody className="space-y-4">
        {!confirming ? (
          <>
            <p className="text-sm text-muted">
              This cannot be undone. Your profile, integrations, readiness scores,
              roadmap, coach chats, and uploaded files will be removed. Copies
              already sent to AI providers may remain under their retention
              policies.
            </p>
            <Button
              type="button"
              variant="outline"
              className="border-danger/40 text-danger hover:bg-danger/10"
              onClick={() => setConfirming(true)}
            >
              Delete account
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">
              Deleting your account will permanently remove:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
              {REMOVAL_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Field label={`Type ${email} to confirm`} htmlFor="confirm-email">
              <Input
                id="confirm-email"
                type="email"
                autoComplete="off"
                value={confirmEmail}
                onChange={({ target }) => setConfirmEmail(target.value)}
                placeholder={email}
                disabled={isPending}
              />
            </Field>
            {error && (
              <p className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={!emailMatches || isPending}
                onClick={handleDelete}
              >
                {isPending ? "Deleting..." : "Delete forever"}
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
