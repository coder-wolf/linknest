import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { parseTheme } from "@/lib/themes";
import { WidgetManager, type ManagedWidget } from "./widget-manager";

export const metadata: Metadata = { title: "Page builder" };

export default async function WidgetsPage() {
  const { user, profile } = await requireProfile();

  const [widgets, links, socials] = await Promise.all([
    prisma.widget.findMany({
      where: { profileId: profile.id },
      orderBy: { position: "asc" },
      select: { id: true, type: true, position: true, isVisible: true, config: true },
    }),
    prisma.link.findMany({
      where: { profileId: profile.id, isActive: true },
      orderBy: { position: "asc" },
      select: { id: true, title: true, description: true, iconUrl: true },
    }),
    prisma.socialAccount.findMany({
      where: { profileId: profile.id, isActive: true },
      orderBy: { position: "asc" },
      select: { id: true, platform: true, url: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Page builder</h1>
          <p className="text-sm text-muted">
            Compose your page from widgets, then drag them into the order you want.
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

      <WidgetManager
        widgets={widgets as ManagedWidget[]}
        profile={{
          displayName: profile.displayName,
          username: profile.username,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          isPublished: profile.isPublished,
        }}
        links={links}
        socials={socials}
        theme={parseTheme(profile.theme)}
        plan={user.subscription?.plan ?? "FREE"}
      />
    </div>
  );
}
