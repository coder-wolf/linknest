"use server";

import { clientKey, rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email";
import { issueEmailVerificationToken } from "@/lib/email-verification";
import { getSessionUser } from "@/lib/session";

export type VerifyState = {
  error?: string;
  success?: string;
};

export async function resendVerificationAction(): Promise<VerifyState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in to resend your verification email." };
  }
  if (user.emailVerified) {
    return { error: "Your email is already verified." };
  }

  const limiter = rateLimit(await clientKey(`verify:${user.id}`), 5, 60 * 60 * 1000);
  if (!limiter.ok) {
    return { error: rateLimitMessage(limiter.retryAfter) };
  }

  const token = await issueEmailVerificationToken(user.id);
  const sent = await sendVerificationEmail({
    to: user.email,
    name: user.profile?.displayName ?? user.email.split("@")[0],
    token,
  });
  if (!sent.ok) {
    return { error: sent.error };
  }

  return { success: `Verification email sent to ${user.email}.` };
}
