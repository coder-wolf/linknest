import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, CardBody, CardHeader } from "@/components/ui/card";
import { requireProfile } from "@/lib/session";
import { DeleteAccountForm, EmailForm, PasswordForm, ProfileForm } from "./settings-forms";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user, profile } = await requireProfile();
  const plan = user.subscription?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Manage your profile, login details and account.</p>
      </div>

      <div className="max-w-3xl space-y-4">
        <ProfileForm
          displayName={profile.displayName}
          username={profile.username}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
        />

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Plan</h2>
              <p className="text-xs text-muted">Your current subscription.</p>
            </div>
            <Badge tone={plan === "FREE" ? "neutral" : "accent"}>{plan}</Badge>
          </CardHeader>
          <CardBody className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted">
              {plan === "FREE"
                ? "You're on the free plan. Upgrade any time."
                : "Manage your plan and billing details."}
            </p>
            <Link
              href="/dashboard/billing"
              className="inline-flex h-9 shrink-0 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-muted"
            >
              {plan === "FREE" ? "See plans" : "Manage plan"}
            </Link>
          </CardBody>
        </Card>

        <EmailForm email={user.email} />
        <PasswordForm />

        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Danger zone
          </h2>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
