import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { requireUser } from "@/lib/session";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Set up your page" };

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.profile) redirect("/dashboard");

  const suggestedName = user.email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <span className="text-sm text-muted">About 2 minutes · free forever</span>
        </div>
      </header>

      <main className="container-page py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Let&apos;s build your corner of the internet.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Pick a username, add a little about yourself, and drop in your first link. You can
            change everything later.
          </p>
          <div className="mt-8">
            <OnboardingForm suggestedName={suggestedName} />
          </div>
        </div>
      </main>
    </div>
  );
}
