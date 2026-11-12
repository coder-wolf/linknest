"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { DEFAULT_THEME } from "@/lib/themes";
import { STARTER_WIDGETS } from "@/lib/widgets";
import {
  bioSchema,
  displayNameSchema,
  httpUrlSchema,
  PLATFORMS,
  usernameSchema,
} from "@/lib/validation";

export type OnboardingState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const platformKeys = PLATFORMS.map((platform) => platform.key) as [string, ...string[]];

const onboardingSchema = z.object({
  username: usernameSchema,
  displayName: displayNameSchema,
  bio: bioSchema.optional(),
  avatarUrl: z.union([z.literal(""), httpUrlSchema]).optional(),
  linkTitle: z.string().trim().max(80).optional(),
  linkUrl: z.union([z.literal(""), httpUrlSchema]).optional(),
  socialPlatform: z.enum(platformKeys).optional(),
  socialUrl: z.union([z.literal(""), httpUrlSchema]).optional(),
});

export async function completeOnboardingAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();
  if (user.profile) redirect("/dashboard");

  const parsed = onboardingSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio") ?? "",
    avatarUrl: formData.get("avatarUrl") ?? "",
    linkTitle: formData.get("linkTitle") ?? "",
    linkUrl: formData.get("linkUrl") ?? "",
    socialPlatform: formData.get("socialPlatform") || undefined,
    socialUrl: formData.get("socialUrl") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { error: parsed.error.issues[0]?.message, fieldErrors };
  }

  const data = parsed.data;

  if (data.linkUrl && !data.linkTitle) {
    return { fieldErrors: { linkTitle: "Add a title for your first link" } };
  }
  if (data.socialUrl && !data.socialPlatform) {
    return { fieldErrors: { socialPlatform: "Choose a platform" } };
  }

  try {
    await prisma.profile.create({
      data: {
        userId: user.id,
        username: data.username,
        displayName: data.displayName,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        theme: DEFAULT_THEME,
        links: data.linkUrl
          ? {
              create: {
                title: data.linkTitle || data.linkUrl,
                url: data.linkUrl,
                position: 0,
              },
            }
          : undefined,
        socials: data.socialUrl && data.socialPlatform
          ? {
              create: {
                platform: data.socialPlatform,
                url: data.socialUrl,
                position: 0,
              },
            }
          : undefined,
        widgets: {
          create: STARTER_WIDGETS.map((widget, index) => ({
            type: widget.type,
            position: index,
            config: widget.config,
          })),
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { fieldErrors: { username: "That username is taken. Try another one." } };
    }
    throw error;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?welcome=1");
}
