"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { httpUrlSchema, linkSchema } from "@/lib/validation";

export type LinkFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

function invalid(error: z.ZodError): LinkFormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
  }
  return { error: error.issues[0]?.message, fieldErrors };
}

async function nextPosition(profileId: string) {
  const last = await prisma.link.findFirst({
    where: { profileId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return (last?.position ?? -1) + 1;
}

export async function createLinkAction(
  _prev: LinkFormState,
  formData: FormData,
): Promise<LinkFormState> {
  const { profile } = await requireProfile();
  const parsed = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const count = await prisma.link.count({ where: { profileId: profile.id } });
  if (count >= 200) return { error: "You've reached the 200 link limit for now." };

  await prisma.link.create({
    data: {
      profileId: profile.id,
      title: parsed.data.title,
      url: parsed.data.url,
      description: parsed.data.description || null,
      position: await nextPosition(profile.id),
    },
  });

  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard");
  revalidatePath(`/${profile.username}`);
  return { success: "Link added" };
}

const updateSchema = linkSchema.extend({
  linkId: z.string().min(1),
  iconUrl: z.union([z.literal(""), httpUrlSchema]).optional(),
});

export async function updateLinkAction(
  _prev: LinkFormState,
  formData: FormData,
): Promise<LinkFormState> {
  const { profile } = await requireProfile();
  const parsed = updateSchema.safeParse({
    linkId: formData.get("linkId"),
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") ?? "",
    iconUrl: formData.get("iconUrl") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const link = await prisma.link.findFirst({
    where: { id: parsed.data.linkId, profileId: profile.id },
    select: { id: true },
  });
  if (!link) return { error: "Link not found." };

  await prisma.link.update({
    where: { id: link.id },
    data: {
      title: parsed.data.title,
      url: parsed.data.url,
      description: parsed.data.description || null,
      iconUrl: parsed.data.iconUrl || null,
    },
  });

  revalidatePath("/dashboard/links");
  revalidatePath(`/${profile.username}`);
  return { success: "Link updated" };
}

export async function deleteLinkAction(formData: FormData) {
  const { profile } = await requireProfile();
  const linkId = String(formData.get("linkId") ?? "");
  if (!linkId) return;

  const link = await prisma.link.findFirst({
    where: { id: linkId, profileId: profile.id },
    select: { id: true, position: true },
  });
  if (!link) return;

  await prisma.$transaction([
    prisma.link.delete({ where: { id: link.id } }),
    prisma.link.updateMany({
      where: { profileId: profile.id, position: { gt: link.position } },
      data: { position: { decrement: 1 } },
    }),
  ]);

  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard");
  revalidatePath(`/${profile.username}`);
}

export async function toggleLinkAction(formData: FormData) {
  const { profile } = await requireProfile();
  const linkId = String(formData.get("linkId") ?? "");
  if (!linkId) return;

  const link = await prisma.link.findFirst({
    where: { id: linkId, profileId: profile.id },
    select: { id: true, isActive: true },
  });
  if (!link) return;

  await prisma.link.update({
    where: { id: link.id },
    data: { isActive: !link.isActive },
  });

  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard");
  revalidatePath(`/${profile.username}`);
}

export async function reorderLinksAction(orderedIds: string[]) {
  const { profile } = await requireProfile();
  const owned = await prisma.link.findMany({
    where: { profileId: profile.id },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((link) => link.id));
  const ids = orderedIds.filter((id) => ownedIds.has(id));
  if (ids.length === 0) return;

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.link.update({ where: { id }, data: { position: index } }),
    ),
  );

  revalidatePath("/dashboard/links");
  revalidatePath(`/${profile.username}`);
}
