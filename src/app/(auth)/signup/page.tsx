import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect(user.profile ? "/dashboard" : "/onboarding");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your LinkNest</h1>
      <p className="mt-1.5 text-sm text-muted">
        One page for every link you share. Free forever, no credit card.
      </p>
      <div className="mt-7">
        <SignupForm />
      </div>
    </div>
  );
}
