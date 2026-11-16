import type { Metadata } from "next";
import { Alert, Card } from "@/components/ui/card";
import { isCheckoutConfigured } from "@/lib/lemonsqueezy";
import type { PlanKey } from "@/lib/plans";
import { requireProfile } from "@/lib/session";
import { BillingPlans } from "./billing-plans";

export const metadata: Metadata = { title: "Billing" };

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const { user } = await requireProfile();
  const subscription = user.subscription;
  const current = (subscription?.plan ?? "FREE") as PlanKey;
  const periodEnd = subscription?.currentPeriodEnd
    ? dateFormat.format(subscription.currentPeriodEnd)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted">
          Simple plans that grow with your audience. Cancel any time.
        </p>
      </div>

      {checkout === "success" ? (
        <Alert tone="success">
          Payment received. Your plan updates as soon as Lemon Squeezy confirms the
          subscription — usually within a few seconds.
        </Alert>
      ) : null}

      <BillingPlans
        currentPlan={current}
        status={subscription?.status ?? null}
        periodEnd={periodEnd}
        portalUrl={subscription?.customerPortalUrl ?? null}
        configured={isCheckoutConfigured()}
      />

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
