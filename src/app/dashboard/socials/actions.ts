"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { PLATFORMS, socialSchema } from "@/lib/validation";

export type SocialFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

const platformKeys = PLATFORMS.map((platform) => platform.key) as [string, ...string[]];

const socialInput = z.object({
  platform: z.enum(platformKeys),
  url: socialSchema.shape.url,
});

function invalid(error: z.ZodError): SocialFormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
  }
  return { error: error.issues[0]?.message, fieldErrors };
}

async function nextPosition(profileId: string) {
  const last = await prisma.socialAccount.findFirst({
    where: { profileId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return (last?.position ?? -1) + 1;
}

export async function createSocialAction(
  _prev: SocialFormState,
  formData: FormData,
): Promise<SocialFormState> {
  const { profile } = await requireProfile();
  const parsed = socialInput.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
  });
  if (!parsed.success) return invalid(parsed.error);

  const count = await prisma.socialAccount.count({ where: { profileId: profile.id } });
  if (count >= 20) return { error: "You can add up to 20 social accounts." };

  await prisma.socialAccount.create({
    data: {
      profileId: profile.id,
      platform: parsed.data.platform,
      url: parsed.data.url,
      position: await nextPosition(profile.id),
    },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${profile.username}`);
  return { success: "Social account added" };
}

const updateInput = socialInput.extend({ socialId: z.string().min(1) });

export async function updateSocialAction(
  _prev: SocialFormState,
  formData: FormData,
): Promise<SocialFormState> {
  const { profile } = await requireProfile();
  const parsed = updateInput.safeParse({
    socialId: formData.get("socialId"),
    platform: formData.get("platform"),
    url: formData.get("url"),
  });
  if (!parsed.success) return invalid(parsed.error);

  const social = await prisma.socialAccount.findFirst({
    where: { id: parsed.data.socialId, profileId: profile.id },
    select: { id: true },
  });
  if (!social) return { error: "Social account not found." };

  await prisma.socialAccount.update({
    where: { id: social.id },
    data: { platform: parsed.data.platform, url: parsed.data.url },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${profile.username}`);
  return { success: "Social account updated" };
}

export async function deleteSocialAction(formData: FormData) {
  const { profile } = await requireProfile();
  const socialId = String(formData.get("socialId") ?? "");
  if (!socialId) return;

  const social = await prisma.socialAccount.findFirst({
    where: { id: socialId, profileId: profile.id },
    select: { id: true, position: true },
  });
  if (!social) return;

  await prisma.$transaction([
    prisma.socialAccount.delete({ where: { id: social.id } }),
    prisma.socialAccount.updateMany({
      where: { profileId: profile.id, position: { gt: social.position } },
      data: { position: { decrement: 1 } },
    }),
  ]);

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${profile.username}`);
}

export async function toggleSocialAction(formData: FormData) {
  const { profile } = await requireProfile();
  const socialId = String(formData.get("socialId") ?? "");
  if (!socialId) return;

  const social = await prisma.socialAccount.findFirst({
    where: { id: socialId, profileId: profile.id },
    select: { id: true, isActive: true },
  });
  if (!social) return;

  await prisma.socialAccount.update({
    where: { id: social.id },
    data: { isActive: !social.isActive },
  });

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${profile.username}`);
}

export async function reorderSocialsAction(orderedIds: string[]) {
  const { profile } = await requireProfile();
  const owned = await prisma.socialAccount.findMany({
    where: { profileId: profile.id },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((social) => social.id));
  const ids = orderedIds.filter((id) => ownedIds.has(id));
  if (ids.length === 0) return;

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.socialAccount.update({ where: { id }, data: { position: index } }),
    ),
  );

  revalidatePath("/dashboard/socials");
  revalidatePath(`/${profile.username}`);
}
