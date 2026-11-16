import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  configuredStoreId,
  isWebhookConfigured,
  mapSubscriptionStatus,
  planForVariant,
  portalUrl,
  subscriptionDates,
  verifyWebhookSignature,
  type LemonSqueezyWebhook,
} from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

const SUBSCRIPTION_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
]);

export async function POST(request: NextRequest) {
  if (!isWebhookConfigured()) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get("x-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LemonSqueezyWebhook;
  try {
    payload = JSON.parse(rawBody) as LemonSqueezyWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.meta?.event_name;
  const data = payload.data;

  if (!event || !SUBSCRIPTION_EVENTS.has(event) || data?.type !== "subscriptions") {
    return NextResponse.json({ received: true, ignored: true });
  }

  const attributes = data.attributes ?? {};
  const subscriptionId = typeof data.id === "string" ? data.id : null;
  if (!subscriptionId) {
    return NextResponse.json({ error: "Missing subscription id" }, { status: 400 });
  }

  const storeId = configuredStoreId();
  if (storeId && String(attributes.store_id ?? "") !== storeId) {
    console.warn(`Lemon Squeezy webhook ${event}: unexpected store ${attributes.store_id}`);
    return NextResponse.json({ error: "Unexpected store" }, { status: 400 });
  }

  // Resolve the local row by the Lemon Squeezy id first, then by the user we
  // passed in at checkout. Never fall back to email, since anyone can enter
  // another person's email at checkout.
  const existing = await prisma.subscription.findFirst({
    where: { lemonSqueezySubscriptionId: subscriptionId },
    select: {
      userId: true,
      plan: true,
      status: true,
      customerPortalUrl: true,
      lemonSqueezyUpdatedAt: true,
    },
  });

  let userId = existing?.userId ?? null;

  if (!userId) {
    const customUserId = payload.meta?.custom_data?.user_id;
    if (customUserId) {
      const user = await prisma.user.findUnique({
        where: { id: customUserId },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }
  }

  if (!userId) {
    console.warn(`Lemon Squeezy webhook ${event}: no matching user for ${subscriptionId}`);
    return NextResponse.json({ received: true, ignored: true });
  }

  // The variant is the source of truth. Checkout custom data can be set by
  // anyone through a checkout link, so it must never select the plan.
  const resolvedPlan = planForVariant(attributes.variant_id);
  const plan =
    event === "subscription_expired"
      ? "FREE"
      : (resolvedPlan ?? existing?.plan ?? "FREE");
  const status = mapSubscriptionStatus(attributes.status) ?? existing?.status ?? "ACTIVE";
  const { renewsAt, endsAt } = subscriptionDates(attributes);
  const updatedAt =
    typeof attributes.updated_at === "string" ? new Date(attributes.updated_at) : null;
  const eventUpdatedAt =
    updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : null;

  // Lemon Squeezy can retry or deliver out of order; don't let an older event
  // overwrite a newer subscription state.
  if (
    existing?.lemonSqueezyUpdatedAt &&
    eventUpdatedAt &&
    eventUpdatedAt < existing.lemonSqueezyUpdatedAt
  ) {
    return NextResponse.json({ received: true, ignored: true });
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status,
      currentPeriodEnd: endsAt ?? renewsAt,
      lemonSqueezyCustomerId:
        attributes.customer_id !== undefined && attributes.customer_id !== null
          ? String(attributes.customer_id)
          : null,
      lemonSqueezySubscriptionId: subscriptionId,
      lemonSqueezyVariantId:
        attributes.variant_id !== undefined && attributes.variant_id !== null
          ? String(attributes.variant_id)
          : null,
      lemonSqueezyUpdatedAt: eventUpdatedAt,
      customerPortalUrl: portalUrl(attributes),
    },
    update: {
      plan,
      status,
      currentPeriodEnd: endsAt ?? renewsAt,
      ...(attributes.customer_id !== undefined && attributes.customer_id !== null
        ? { lemonSqueezyCustomerId: String(attributes.customer_id) }
        : {}),
      lemonSqueezySubscriptionId: subscriptionId,
      ...(attributes.variant_id !== undefined && attributes.variant_id !== null
        ? { lemonSqueezyVariantId: String(attributes.variant_id) }
        : {}),
      ...(eventUpdatedAt ? { lemonSqueezyUpdatedAt: eventUpdatedAt } : {}),
      ...(portalUrl(attributes) ?? existing?.customerPortalUrl
        ? { customerPortalUrl: portalUrl(attributes) ?? existing?.customerPortalUrl }
        : {}),
    },
  });

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");

  return NextResponse.json({ received: true });
}
