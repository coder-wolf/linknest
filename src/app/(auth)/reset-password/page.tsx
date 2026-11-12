import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-1.5 text-sm text-muted">
        Pick something you haven&apos;t used before. Your other sessions stay signed in.
      </p>
      <div className="mt-7">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-4">
            <Alert tone="error">
              This reset link is missing its token. Request a new link to continue.
            </Alert>
            <Link
              href="/forgot-password"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-white"
            >
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
