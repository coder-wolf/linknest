"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { UploadError, removeAvatar as deleteAvatarBlob, uploadAvatar } from "@/lib/uploads";
import { displayNameSchema } from "@/lib/validation";

export type IdentityState = {
  error?: string;
  success?: string;
  fieldErrors?: { displayName?: string };
};

export async function setPublishedAction(formData: FormData) {
  const { profile } = await requireProfile();
  const published = formData.get("published") === "true";

  await prisma.profile.update({
    where: { id: profile.id },
    data: { isPublished: published },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${profile.username}`);
}

const identitySchema = z.object({ displayName: displayNameSchema });

export async function updateIdentityAction(
  _prev: IdentityState,
  formData: FormData,
): Promise<IdentityState> {
  const { user, profile } = await requireProfile();
  const parsed = identitySchema.safeParse({ displayName: formData.get("displayName") });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Enter a display name.";
    return { error: message, fieldErrors: { displayName: message } };
  }

  const avatarFile = formData.get("avatarFile");
  const shouldRemoveAvatar = formData.get("removeAvatar") === "on";

  let avatarUrl = profile.avatarUrl;
  let uploadedUrl: string | null = null;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    try {
      uploadedUrl = await uploadAvatar({
        userId: user.id,
        file: avatarFile,
        previousUrl: profile.avatarUrl,
      });
      avatarUrl = uploadedUrl;
    } catch (error) {
      return {
        error:
          error instanceof UploadError
            ? error.message
            : "We couldn't upload that photo. Please try again.",
      };
    }
  } else if (shouldRemoveAvatar) {
    avatarUrl = null;
  }

  try {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { displayName: parsed.data.displayName, avatarUrl },
    });
  } catch (error) {
    if (uploadedUrl) await deleteAvatarBlob(uploadedUrl);
    throw error;
  }

  if (shouldRemoveAvatar && !uploadedUrl) {
    await deleteAvatarBlob(profile.avatarUrl);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/${profile.username}`);
  return { success: "Profile updated" };
}
