import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert } from "@/components/ui/card";
import { getSessionUser } from "@/lib/session";
import { ResendVerificationForm } from "./resend-verification";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; error?: string; emailChanged?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();
  const justVerified = params.verified === "1";
  const invalidToken = params.error === "invalid";
  const emailChanged = params.emailChanged === "1";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      <main className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-[0_24px_60px_-40px_rgba(23,22,15,0.45)] sm:p-8">
          {justVerified ? (
            <>
              <MailCheck className="size-8 text-success" />
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">Email verified</h1>
              <p className="mt-2 text-sm text-muted">
                Your email address is confirmed. You&apos;re ready to keep building.
              </p>
              <Link
                href={user?.profile ? "/dashboard" : user ? "/onboarding" : "/login"}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-white"
              >
                {user?.profile ? "Go to dashboard" : user ? "Continue setup" : "Log in"}
              </Link>
            </>
          ) : invalidToken ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Link expired</h1>
              <p className="mt-2 text-sm text-muted">
                This verification link is invalid or has expired. Request a new one below.
              </p>
              {user && !user.emailVerified ? (
                <div className="mt-6">
                  <ResendVerificationForm />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-white"
                >
                  Log in
                </Link>
              )}
            </>
          ) : user && !user.emailVerified ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted">
                {emailChanged
                  ? "We sent a verification link to your new email address."
                  : "We sent a verification link when you signed up. Click it to unlock your dashboard."}
              </p>
              <p className="mt-3 rounded-xl bg-surface-muted px-3.5 py-2.5 text-sm font-medium">
                {user.email}
              </p>
              {params.emailChanged ? (
                <div className="mt-4">
                  <Alert tone="info">
                    Your new email must be verified before you can use the dashboard again.
                  </Alert>
                </div>
              ) : null}
              <div className="mt-5">
                <ResendVerificationForm />
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-muted">
                <Link href="/contact" className="hover:text-foreground">
                  Need help?
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="hover:text-foreground">
                    Sign out
                  </button>
                </form>
              </div>
            </>
          ) : user ? (
            <>
              <MailCheck className="size-8 text-success" />
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">Email verified</h1>
              <p className="mt-2 text-sm text-muted">
                Your email address is already confirmed.
              </p>
              <Link
                href={user.profile ? "/dashboard" : "/onboarding"}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-white"
              >
                {user.profile ? "Go to dashboard" : "Continue setup"}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
              <p className="mt-2 text-sm text-muted">
                Open the verification link we emailed you, or log in to request a new one.
              </p>
              <Link
                href="/login"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-white"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
