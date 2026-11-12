"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { themeSchema } from "@/lib/themes";

export type ThemeState = {
  error?: string;
  success?: string;
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateThemeAction(_prev: ThemeState, formData: FormData): Promise<ThemeState> {
  const { profile } = await requireProfile();

  const backgroundImageUrl = text(formData, "backgroundImageUrl");

  const parsed = themeSchema.safeParse({
    preset: formData.get("preset"),
    background: formData.get("background"),
    textColor: formData.get("textColor"),
    mutedColor: formData.get("mutedColor"),
    accentColor: formData.get("accentColor"),
    buttonColor: formData.get("buttonColor"),
    buttonTextColor: formData.get("buttonTextColor"),
    cardColor: formData.get("cardColor"),
    buttonStyle: formData.get("buttonStyle"),
    buttonShape: formData.get("buttonShape"),
    shadow: formData.get("shadow"),
    font: formData.get("font"),
    layout: formData.get("layout"),
    texture: formData.get("texture"),
    avatarShape: formData.get("avatarShape"),
    backgroundImageUrl: backgroundImageUrl || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your theme settings" };
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      theme: parsed.data,
      backgroundImageUrl: parsed.data.backgroundImageUrl,
    },
  });

  revalidatePath("/dashboard/appearance");
  revalidatePath("/dashboard/widgets");
  revalidatePath("/dashboard");
  revalidatePath(`/${profile.username}`);
  return { success: "Theme saved" };
}
