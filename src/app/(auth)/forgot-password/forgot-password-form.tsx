"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction, type AuthState } from "../actions";
import { Alert } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";

const initialState: AuthState = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordResetAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.message ? <Alert tone="success">{state.message}</Alert> : null}
      {state.resetUrl ? (
        <Alert tone="info">
          <span className="font-medium">Development mode:</span>{" "}
          <Link href={state.resetUrl} className="underline underline-offset-4">
            open your reset link
          </Link>
        </Alert>
      ) : null}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <SubmitButton className="w-full" pendingLabel="Sending link…">
        Send reset link
      </SubmitButton>

      <p className="text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
