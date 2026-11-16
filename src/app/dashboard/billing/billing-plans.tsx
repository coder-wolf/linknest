"use client";

import { useActionState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Alert, Badge, Card } from "@/components/ui/card";
import { PLANS, type PlanKey } from "@/lib/plans";
import { cn } from "@/lib/utils";
import {
  cancelPlanAction,
  checkoutAction,
  type BillingState,
  type CancelPlanState,
} from "./actions";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  PAST_DUE: "Payment past due",
  PAUSED: "Paused",
  CANCELED: "Canceled",
};

export function BillingPlans({
  currentPlan,
  status,
  periodEnd,
  portalUrl,
  configured,
}: {
  currentPlan: PlanKey;
  status: string | null;
  periodEnd: string | null;
  portalUrl: string | null;
  configured: boolean;
}) {
  const [state, formAction] = useActionState<BillingState, FormData>(checkoutAction, {});
  const [cancelState, cancelAction] = useActionState<CancelPlanState, FormData>(
    cancelPlanAction,
    {},
  );
  const hasPaidSubscription = currentPlan !== "FREE";

  return (
    <div className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {cancelState.error ? <Alert tone="error">{cancelState.error}</Alert> : null}
      {cancelState.success ? <Alert tone="success">{cancelState.success}</Alert> : null}

      {hasPaidSubscription && status ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 bg-surface-muted/60 p-5">
          <div>
            <p className="text-sm font-semibold">
              {currentPlan} plan · {STATUS_LABELS[status] ?? status}
            </p>
            <p className="mt-1 text-xs text-muted">
              {status === "CANCELED"
                ? periodEnd
                  ? `Access ends ${periodEnd}.`
                  : "Cancellation scheduled."
                : periodEnd
                  ? `Renews ${periodEnd}.`
                  : "Billing details are managed by Lemon Squeezy."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {portalUrl ? (
              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium transition hover:bg-surface-muted"
              >
                Manage subscription
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
            {status !== "CANCELED" ? (
              <form
                action={cancelAction}
                onSubmit={(event) => {
                  if (
                    !window.confirm(
                      "Cancel your plan? You'll keep access until the end of the current billing period.",
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <Button type="submit" variant="danger" size="sm">
                  Cancel plan
                </Button>
              </form>
            ) : null}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.key;

          return (
            <Card
              key={plan.key}
              className={cn(
                "relative flex flex-col p-5",
                plan.recommended && "border-ink shadow-md",
              )}
            >
              {plan.recommended ? (
                <Badge tone="accent" className="absolute -top-3 left-5">
                  Recommended
                </Badge>
              ) : null}

              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">{plan.name}</h2>
                {isCurrent ? <Badge tone="success">Current plan</Badge> : null}
              </div>
              <p className="mt-3">
                <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>{" "}
                <span className="text-sm text-muted">{plan.cadence}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {isCurrent ? (
                  <div className="flex h-10 items-center justify-center rounded-full bg-surface-muted text-sm font-medium text-muted">
                    You&apos;re on this plan
                  </div>
                ) : plan.key === "FREE" ? (
                  portalUrl ? (
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-medium transition hover:bg-surface-muted"
                    >
                      Cancel in customer portal
                    </a>
                  ) : (
                    <div className="flex h-10 items-center justify-center rounded-full bg-surface-muted px-3 text-center text-xs font-medium text-muted">
                      {status === "CANCELED"
                        ? "You'll move to Free when access ends"
                        : "Use Cancel plan above to downgrade"}
                    </div>
                  )
                ) : hasPaidSubscription ? (
                  portalUrl ? (
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-medium transition hover:bg-surface-muted"
                    >
                      Change plan in portal
                    </a>
                  ) : (
                    <div className="flex h-10 items-center justify-center rounded-full bg-surface-muted px-3 text-center text-xs font-medium text-muted">
                      Cancel your current plan above to switch
                    </div>
                  )
                ) : (
                  <form action={formAction}>
                    <input type="hidden" name="plan" value={plan.key} />
                    <SubmitButton
                      variant={plan.recommended ? "primary" : "outline"}
                      className="w-full"
                      pendingLabel="Opening checkout…"
                    >
                      Upgrade to {plan.name}
                    </SubmitButton>
                  </form>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted">
        {configured
          ? "Secure checkout and subscription billing by Lemon Squeezy. Cancel any time."
          : "Payments aren't configured yet. Add your Lemon Squeezy credentials to enable checkout."}
      </p>
    </div>
  );
}
