"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction, type AuthState } from "../actions";
import { Alert } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";

const initialState: AuthState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.message ? (
        <Alert tone="success">
          {state.message}{" "}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </Alert>
      ) : null}

      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          required
        />
      </div>

      <SubmitButton className="w-full" pendingLabel="Updating password…">
        Set new password
      </SubmitButton>
    </form>
  );
}
