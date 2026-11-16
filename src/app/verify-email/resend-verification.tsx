"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Alert } from "@/components/ui/card";
import { resendVerificationAction, type VerifyState } from "./actions";

const initialState: VerifyState = {};

export function ResendVerificationForm() {
  const [state, formAction] = useActionState(resendVerificationAction, initialState);

  return (
    <div className="space-y-3">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <form action={formAction}>
        <SubmitButton variant="outline" className="w-full" pendingLabel="Sending…">
          Resend verification email
        </SubmitButton>
      </form>
    </div>
  );
}
