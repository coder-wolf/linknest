import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { parseTheme } from "@/lib/themes";
import { AppearanceForm } from "./appearance-form";

export const metadata: Metadata = { title: "Appearance" };

export default async function AppearancePage() {
  const { user, profile } = await requireProfile();

  const [links, socials, widgets] = await Promise.all([
    prisma.link.findMany({
      where: { profileId: profile.id, isActive: true },
      orderBy: { position: "asc" },
      select: { id: true, title: true, description: true, iconUrl: true },
      take: 6,
    }),
    prisma.socialAccount.findMany({
      where: { profileId: profile.id, isActive: true },
      orderBy: { position: "asc" },
      select: { id: true, platform: true, url: true },
      take: 8,
    }),
    prisma.widget.findMany({
      where: { profileId: profile.id },
      orderBy: { position: "asc" },
      select: { id: true, type: true, isVisible: true, config: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appearance</h1>
          <p className="text-sm text-muted">
            Make your page feel like you — colors, type, and layout.
          </p>
        </div>
        <Link
          href={`/${profile.username}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          Preview page <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <AppearanceForm
        initialTheme={parseTheme(profile.theme)}
        profile={{
          displayName: profile.displayName,
          username: profile.username,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          isPublished: profile.isPublished,
        }}
        links={links}
        socials={socials}
        widgets={widgets}
        plan={user.subscription?.plan ?? "FREE"}
      />
    </div>
  );
}
