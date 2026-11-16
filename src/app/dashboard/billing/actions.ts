"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  appUrl,
  cancelSubscription,
  createCheckout,
  isCheckoutConfigured,
} from "@/lib/lemonsqueezy";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";

export type BillingState = {
  error?: string;
};

export type CancelPlanState = {
  error?: string;
  success?: string;
};

const checkoutSchema = z.object({
  plan: z.enum(["PRO", "BUSINESS"]),
});

export async function checkoutAction(
  _prev: BillingState,
  formData: FormData,
): Promise<BillingState> {
  const { user } = await requireProfile();
  const parsed = checkoutSchema.safeParse({ plan: formData.get("plan") });
  if (!parsed.success) return { error: "Choose a plan to continue." };

  const subscription = user.subscription;
  if (
    subscription?.plan === parsed.data.plan &&
    (subscription.status === "ACTIVE" || subscription.status === "PAST_DUE")
  ) {
    return { error: "You're already subscribed to this plan." };
  }

  if (!isCheckoutConfigured()) {
    return {
      error:
        "Payments aren't configured yet. Add your Lemon Squeezy API key, store ID and variant IDs first.",
    };
  }

  let url: string;
  try {
    url = await createCheckout({
      plan: parsed.data.plan,
      email: user.email,
      userId: user.id,
      redirectUrl: `${appUrl()}/dashboard/billing?checkout=success`,
    });
  } catch (error) {
    console.error("Could not start Lemon Squeezy checkout", error);
    return { error: "We couldn't start checkout. Please try again in a moment." };
  }

  redirect(url);
}

export async function cancelPlanAction(): Promise<CancelPlanState> {
  const { user } = await requireProfile();
  const subscription = user.subscription;

  if (user.email === "demo@linknest.com") {
    return {
      error:
        "The shared demo account keeps its Pro plan so everyone can explore the app. Sign up for your own account to test cancelling.",
    };
  }

  if (!subscription || subscription.plan === "FREE") {
    return { error: "You're already on the Free plan." };
  }
  if (subscription.status === "CANCELED") {
    return { error: "Your plan is already scheduled to cancel." };
  }

  if (subscription.lemonSqueezySubscriptionId) {
    try {
      const { endsAt } = await cancelSubscription(
        subscription.lemonSqueezySubscriptionId,
      );
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          status: "CANCELED",
          ...(endsAt ? { currentPeriodEnd: endsAt } : {}),
        },
      });
    } catch (error) {
      console.error("Could not cancel subscription", error);
      return {
        error:
          "We couldn't cancel your plan automatically. Please use the customer portal or contact support.",
      };
    }

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard");
    return { success: "Your plan has been canceled." };
  }

  // Comped and manually-granted plans have no provider subscription, so they
  // downgrade immediately.
  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      plan: "FREE",
      status: "ACTIVE",
      currentPeriodEnd: null,
      customerPortalUrl: null,
    },
  });

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");
  return { success: "Your plan has been canceled. You're back on Free." };
}
