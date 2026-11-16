import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true, subscription: true },
  });
  if (!user) return null;

  // Password changes and resets bump this counter, revoking every older JWT.
  const tokenVersion = (session.user as { sessionVersion?: number }).sessionVersion ?? 0;
  if (tokenVersion !== user.sessionVersion) return null;

  return user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.emailVerified) redirect("/verify-email");
  return user;
}

export async function requireProfile() {
  const user = await requireUser();
  if (!user.profile) redirect("/onboarding");
  return { user, profile: user.profile };
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
export type ProfileRecord = NonNullable<SessionUser["profile"]>;
