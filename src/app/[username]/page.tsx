import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileCanvas, type CanvasWidget } from "@/components/profile-canvas";
import { ViewTracker } from "@/components/view-tracker";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { fontStack, parseTheme } from "@/lib/themes";
import { STARTER_WIDGETS } from "@/lib/widgets";
import { appUrl } from "@/lib/utils";

type PageProps = { params: Promise<{ username: string }> };

async function getProfile(username: string) {
  return prisma.profile.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      user: { select: { subscription: { select: { plan: true } } } },
      links: {
        where: { isActive: true },
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
          description: true,
          iconUrl: true,
        },
      },
      socials: {
        where: { isActive: true },
        orderBy: { position: "asc" },
        select: { id: true, platform: true, url: true },
      },
      widgets: {
        orderBy: { position: "asc" },
        select: { id: true, type: true, isVisible: true, config: true },
      },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile || !profile.isPublished) {
    return { title: "Page not found" };
  }

  const title = `${profile.displayName} (@${profile.username})`;
  const description =
    profile.bio ?? `${profile.displayName} on LinkNest — every link in one place.`;

  return {
    title,
    description,
    alternates: { canonical: appUrl(`/${profile.username}`) },
    openGraph: {
      type: "profile",
      title,
      description,
      url: appUrl(`/${profile.username}`),
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const viewer = await getSessionUser();
  const isOwner = viewer?.id === profile.userId;
  if (!profile.isPublished && !isOwner) notFound();

  const theme = parseTheme(profile.theme);
  const plan = profile.user.subscription?.plan ?? "FREE";
  const showBranding = plan === "FREE";

  const widgets: CanvasWidget[] =
    profile.widgets.length > 0
      ? profile.widgets.map((widget) => ({
          id: widget.id,
          type: widget.type,
          isVisible: widget.isVisible,
          config: widget.config,
        }))
      : STARTER_WIDGETS.map((widget, index) => ({
          id: `starter-${index}`,
          type: widget.type,
          isVisible: true,
          config: widget.config,
        }));

  return (
    <div className="min-h-screen" style={{ fontFamily: fontStack(theme.font) }}>
      {!profile.isPublished ? (
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 bg-amber-400/95 px-4 py-2 text-center text-xs font-medium text-amber-950">
          Preview mode — this page is not published yet.
          <Link href="/dashboard" className="underline underline-offset-4">
            Back to dashboard
          </Link>
        </div>
      ) : null}

      <ProfileCanvas
        profile={{
          displayName: profile.displayName,
          username: profile.username,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
        }}
        links={profile.links}
        socials={profile.socials}
        widgets={widgets}
        theme={theme}
        showBranding={showBranding}
        interactive
        className={profile.isPublished ? "min-h-screen" : "min-h-[calc(100vh-40px)]"}
      />

      {profile.isPublished && !isOwner ? <ViewTracker profileId={profile.id} /> : null}
    </div>
  );
}
