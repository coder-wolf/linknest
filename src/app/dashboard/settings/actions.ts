"use server";

import { Prisma } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireProfile, requireUser } from "@/lib/session";
import {
  bioSchema,
  displayNameSchema,
  emailSchema,
  httpUrlSchema,
  passwordSchema,
  usernameSchema,
} from "@/lib/validation";

export type SettingsState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

function invalid(error: z.ZodError): SettingsState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
  }
  return { error: error.issues[0]?.message, fieldErrors };
}

const profileSchema = z.object({
  displayName: displayNameSchema,
  username: usernameSchema,
  bio: bioSchema.optional(),
  avatarUrl: z.union([z.literal(""), httpUrlSchema]).optional(),
});

export async function updateProfileAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const { profile } = await requireProfile();
  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    bio: formData.get("bio") ?? "",
    avatarUrl: formData.get("avatarUrl") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const oldUsername = profile.username;

  try {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        displayName: parsed.data.displayName,
        username: parsed.data.username,
        bio: parsed.data.bio || null,
        avatarUrl: parsed.data.avatarUrl || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { fieldErrors: { username: "That username is taken. Try another one." } };
    }
    throw error;
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath(`/${oldUsername}`);
  revalidatePath(`/${parsed.data.username}`);
  return { success: "Profile updated" };
}

export async function updateEmailAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const user = await requireUser();
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { fieldErrors: { email: "Enter a valid email address" } };

  const password = String(formData.get("password") ?? "");
  const validPassword = password ? await compare(password, user.passwordHash) : false;
  if (!validPassword) return { fieldErrors: { password: "Password is incorrect" } };

  if (email.data === user.email) return { success: "That's already your email" };

  const existing = await prisma.user.findUnique({
    where: { email: email.data },
    select: { id: true },
  });
  if (existing) return { fieldErrors: { email: "That email is already in use" } };

  await prisma.user.update({ where: { id: user.id }, data: { email: email.data } });

  revalidatePath("/dashboard/settings");
  return { success: "Email updated" };
}

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function updatePasswordAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const user = await requireUser();
  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return invalid(parsed.error);

  const valid = await compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { fieldErrors: { currentPassword: "Current password is incorrect" } };

  const passwordHash = await hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: "Password updated" };
}

export async function deleteAccountAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const user = await requireUser();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (confirmation !== "DELETE") {
    return { fieldErrors: { confirmation: 'Type DELETE to confirm' } };
  }

  const valid = password ? await compare(password, user.passwordHash) : false;
  if (!valid) return { fieldErrors: { password: "Password is incorrect" } };

  await prisma.user.delete({ where: { id: user.id } });
  await signOut({ redirectTo: "/" });
  return {};
}
