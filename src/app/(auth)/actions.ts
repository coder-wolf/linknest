"use server";

import { createHash, randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientKey, rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { appUrl } from "@/lib/utils";
import { emailSchema, passwordSchema } from "@/lib/validation";

export type AuthState = {
  error?: string;
  message?: string;
  resetUrl?: string;
};

const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please check your details";
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const limiter = rateLimit(await clientKey("signup"), 10, 60 * 60 * 1000);
  if (!limiter.ok) return { error: rateLimitMessage(limiter.retryAfter) };

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      subscription: { create: {} },
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/onboarding" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in." };
    }
    throw error;
  }

  return {};
}

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const limiter = rateLimit(await clientKey("login"), 10, 15 * 60 * 1000);
  if (!limiter.ok) return { error: rateLimitMessage(limiter.retryAfter) };

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  return {};
}

export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { error: "Enter a valid email address" };

  const limiter = rateLimit(await clientKey("reset"), 5, 60 * 60 * 1000);
  if (!limiter.ok) return { error: rateLimitMessage(limiter.retryAfter) };

  const genericMessage =
    "If an account exists for that email, a reset link is on its way. The link expires in one hour.";

  const user = await prisma.user.findUnique({ where: { email: email.data }, select: { id: true } });
  if (!user) return { message: genericMessage };

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    }),
  ]);

  const resetUrl = `${appUrl("/reset-password")}?token=${token}`;

  // No email provider is configured yet. The link is logged so local
  // development works end-to-end; wire this to Resend/SES before launch.
  console.info(`[LinkNest] Password reset link for ${email.data}: ${resetUrl}`);

  return {
    message: genericMessage,
    resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl,
  };
}

const resetSchema = z
  .object({
    token: z.string().min(10, "Reset link is invalid"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { message: "Password updated. You can now log in with your new password." };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
