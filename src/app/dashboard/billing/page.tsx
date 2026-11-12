import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Badge, Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/session";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const { user } = await requireProfile();
  const current = user.subscription?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted">
          Simple plans that grow with your audience. Cancel any time.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = current === plan.key;
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

              <div className="flex items-center justify-between">
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
                ) : (
                  <>
                    <button
                      type="button"
                      disabled
                      className="h-10 w-full cursor-not-allowed rounded-full bg-ink/40 text-sm font-medium text-white"
                    >
                      {plan.key === "FREE" ? "Downgrade" : "Upgrade"} — coming soon
                    </button>
                    <p className="mt-2 text-center text-[11px] text-muted">
                      Payments are the next milestone. No charge will be made.
                    </p>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-surface-muted/60 p-5">
        <p className="text-sm font-semibold">A note on pricing</p>
        <p className="mt-1 text-sm text-muted">
          These prices are illustrative while we validate demand. Early adopters will get a
          generous free run of Pro features.
        </p>
      </Card>
    </div>
  );
}
