import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, subscription: true },
  });
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireProfile() {
  const user = await requireUser();
  if (!user.profile) redirect("/onboarding");
  return { user, profile: user.profile };
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
export type ProfileRecord = NonNullable<SessionUser["profile"]>;
