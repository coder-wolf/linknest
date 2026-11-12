"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";

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
