import { createHmac, timingSafeEqual } from "node:crypto";
import type { PlanKey } from "@/lib/plans";

const API_BASE = "https://api.lemonsqueezy.com/v1";

export type PaidPlanKey = Extract<PlanKey, "PRO" | "BUSINESS">;

type LemonSqueezyConfig = {
  apiKey?: string;
  storeId?: string;
  webhookSecret?: string;
  proVariantId?: string;
  businessVariantId?: string;
};

function config(): LemonSqueezyConfig {
  return {
    apiKey: process.env.LEMONSQUEEZY_API_KEY?.trim(),
    storeId: process.env.LEMONSQUEEZY_STORE_ID?.trim(),
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim(),
    proVariantId: process.env.LEMONSQUEEZY_VARIANT_PRO?.trim(),
    businessVariantId: process.env.LEMONSQUEEZY_VARIANT_BUSINESS?.trim(),
  };
}

export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function isPaidPlan(value: unknown): value is PaidPlanKey {
  return value === "PRO" || value === "BUSINESS";
}

export function variantIdForPlan(plan: PaidPlanKey) {
  const env = config();
  return plan === "PRO" ? env.proVariantId : env.businessVariantId;
}

export function planForVariant(variantId: unknown): PaidPlanKey | null {
  if (variantId === undefined || variantId === null) return null;
  const env = config();
  const value = String(variantId);
  if (env.proVariantId && value === env.proVariantId) return "PRO";
  if (env.businessVariantId && value === env.businessVariantId) return "BUSINESS";
  return null;
}

/** Both the store and at least one plan variant must be configured to sell. */
export function isCheckoutConfigured() {
  const env = config();
  return Boolean(
    env.apiKey && env.storeId && (env.proVariantId || env.businessVariantId),
  );
}

export function isWebhookConfigured() {
  return Boolean(config().webhookSecret);
}

export function configuredStoreId() {
  return config().storeId ?? null;
}

export async function cancelSubscription(subscriptionId: string) {
  const env = config();
  if (!env.apiKey) {
    throw new Error("Lemon Squeezy is not configured.");
  }

  const response = await fetch(`${API_BASE}/subscriptions/${subscriptionId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${env.apiKey}`,
    },
  });

  // A missing subscription is already effectively cancelled.
  if (response.status === 404) {
    return { endsAt: null as Date | null };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(
      `Lemon Squeezy cancel failed (${response.status}): ${detail.slice(0, 500)}`,
    );
    throw new Error("Lemon Squeezy cancellation request failed.");
  }

  const payload = (await response.json().catch(() => null)) as {
    data?: { attributes?: { ends_at?: unknown } };
  } | null;
  const rawEndsAt = payload?.data?.attributes?.ends_at;
  const endsAt =
    typeof rawEndsAt === "string" ? new Date(rawEndsAt) : null;

  return {
    endsAt: endsAt && !Number.isNaN(endsAt.getTime()) ? endsAt : null,
  };
}

export async function createCheckout({
  plan,
  email,
  userId,
  redirectUrl,
}: {
  plan: PaidPlanKey;
  email: string;
  userId: string;
  redirectUrl: string;
}) {
  const env = config();
  const variantId = variantIdForPlan(plan);

  if (!env.apiKey || !env.storeId || !variantId) {
    throw new Error(`Lemon Squeezy is not configured for the ${plan} plan.`);
  }

  const response = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${env.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email,
            custom: { user_id: userId, plan },
          },
          product_options: {
            redirect_url: redirectUrl,
            enabled_variants: [Number(variantId)],
          },
        },
        relationships: {
          store: { data: { type: "stores", id: env.storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(
      `Lemon Squeezy checkout failed (${response.status}): ${detail.slice(0, 500)}`,
    );
    throw new Error("Lemon Squeezy checkout request failed.");
  }

  const payload = (await response.json()) as {
    data?: { attributes?: { url?: unknown } };
  };
  const url = payload.data?.attributes?.url;
  if (typeof url !== "string" || !url.startsWith("https://")) {
    throw new Error("Lemon Squeezy did not return a checkout URL.");
  }

  return url;
}

export type LemonSqueezyWebhook = {
  meta?: {
    event_name?: string;
    custom_data?: { user_id?: string; plan?: string };
  };
  data?: {
    id?: string;
    type?: string;
    attributes?: Record<string, unknown>;
  };
};

/** Lemon Squeezy signs the raw request body with HMAC-SHA256. */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = config().webhookSecret;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const provided = signature.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(provided)) return false;

  const providedBuffer = Buffer.from(provided, "hex");
  return (
    providedBuffer.length === expected.length &&
    timingSafeEqual(providedBuffer, expected)
  );
}

export type LemonSqueezyStatus = "ACTIVE" | "PAST_DUE" | "PAUSED" | "CANCELED";

export function mapSubscriptionStatus(status: unknown): LemonSqueezyStatus | null {
  switch (status) {
    case "on_trial":
    case "active":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "paused":
      return "PAUSED";
    case "cancelled":
    case "expired":
      return "CANCELED";
    default:
      return null;
  }
}

function dateOrNull(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function subscriptionDates(attributes: Record<string, unknown>) {
  return {
    renewsAt: dateOrNull(attributes.renews_at),
    endsAt: dateOrNull(attributes.ends_at),
  };
}

export function portalUrl(attributes: Record<string, unknown>) {
  const urls = attributes.urls;
  if (!urls || typeof urls !== "object") return null;
  const value = (urls as Record<string, unknown>).customer_portal;
  return typeof value === "string" && value.startsWith("https://") ? value : null;
}
