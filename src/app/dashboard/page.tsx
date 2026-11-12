import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Link2,
  MousePointerClick,
  Palette,
  Share2,
  Sparkles,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, CardBody, CardHeader, EmptyState } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { formatNumber, initials, profileUrl } from "@/lib/utils";
import { setPublishedAction } from "./actions";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const { profile } = await requireProfile();

  const [views, clicks, activeLinks, totalLinks, recentLinks] = await Promise.all([
    prisma.analyticsEvent.count({ where: { profileId: profile.id, type: "VIEW" } }),
    prisma.analyticsEvent.count({ where: { profileId: profile.id, type: "CLICK" } }),
    prisma.link.count({ where: { profileId: profile.id, isActive: true } }),
    prisma.link.count({ where: { profileId: profile.id } }),
    prisma.link.findMany({
      where: { profileId: profile.id },
      orderBy: { position: "asc" },
      take: 4,
    }),
  ]);

  const ctr = views > 0 ? (clicks / views) * 100 : 0;
  const url = profileUrl(profile.username);

  const stats = [
    { label: "Profile views", value: formatNumber(views), icon: Eye, hint: "All time" },
    { label: "Link clicks", value: formatNumber(clicks), icon: MousePointerClick, hint: "All time" },
    { label: "Click-through rate", value: `${ctr.toFixed(1)}%`, icon: BarChart3, hint: "Clicks ÷ views" },
    {
      label: "Active links",
      value: String(activeLinks),
      icon: Link2,
      hint: `${totalLinks} total`,
    },
  ];

  return (
    <div className="space-y-6">
      {welcome ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Your page is ready 🎉</p>
            <p className="text-sm text-emerald-800">
              Preview it, then publish when you&apos;re happy. You can keep editing any time.
            </p>
          </div>
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-900 underline underline-offset-4"
          >
            Preview page <ArrowUpRight className="size-4" />
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted">
          Everything about your page, in one glance.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex items-start gap-4 p-5">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-lg font-semibold">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" className="size-full object-cover" />
              ) : (
                initials(profile.displayName || profile.username)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-lg font-semibold">{profile.displayName}</p>
                {profile.isPublished ? (
                  <Badge tone="success">Live</Badge>
                ) : (
                  <Badge tone="warning">Draft</Badge>
                )}
              </div>
              <p className="text-sm text-muted">@{profile.username}</p>
              {profile.bio ? (
                <p className="mt-2 max-w-xl text-sm text-muted">{profile.bio}</p>
              ) : (
                <p className="mt-2 text-sm text-muted">No bio yet — add one in settings.</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-9 items-center rounded-full bg-surface-muted px-3 text-sm text-muted">
                  {url.replace(/^https?:\/\//, "")}
                </span>
                <CopyButton value={url} />
                <Link
                  href={`/${profile.username}`}
                  target="_blank"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground transition hover:bg-surface-muted"
                >
                  Preview <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2 border-t border-border p-5 md:border-l md:border-t-0">
            <form action={setPublishedAction}>
              <input type="hidden" name="published" value={String(!profile.isPublished)} />
              <SubmitButton
                variant={profile.isPublished ? "outline" : "accent"}
                className="w-full"
                pendingLabel="Saving…"
              >
                {profile.isPublished ? "Unpublish page" : "Publish page"}
              </SubmitButton>
            </form>
            <p className="max-w-[220px] text-xs text-muted">
              {profile.isPublished
                ? "Anyone with your link can view your page."
                : "Your page is hidden until you publish it."}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{stat.label}</p>
                <Icon className="size-4 text-muted" />
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.hint}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Your links</h2>
              <p className="text-xs text-muted">The first four, in display order.</p>
            </div>
            <Link
              href="/dashboard/links"
              className="text-xs font-medium text-muted hover:text-foreground"
            >
              Manage all
            </Link>
          </CardHeader>
          <CardBody className="space-y-2">
            {recentLinks.length === 0 ? (
              <EmptyState
                title="No links yet"
                description="Add your first link and it will show up here."
                action={
                  <Link
                    href="/dashboard/links"
                    className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-white"
                  >
                    Add a link
                  </Link>
                }
              />
            ) : (
              recentLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{link.title}</p>
                    <p className="truncate text-xs text-muted">{link.url}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
                    {!link.isActive ? <Badge>Hidden</Badge> : null}
                    <span>{formatNumber(link.clicks)} clicks</span>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Quick actions</h2>
            </CardHeader>
            <CardBody className="grid grid-cols-2 gap-2">
              {[
                { href: "/dashboard/links", label: "Add link", icon: Link2 },
                { href: "/dashboard/appearance", label: "Theme", icon: Palette },
                { href: "/dashboard/socials", label: "Socials", icon: Share2 },
                { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex flex-col gap-2 rounded-xl border border-border px-3 py-3 text-sm font-medium transition hover:border-ink/20 hover:bg-surface-muted"
                  >
                    <Icon className="size-4 text-muted" />
                    {action.label}
                  </Link>
                );
              })}
            </CardBody>
          </Card>

          <Card className="bg-surface-muted/60 p-5">
            <Sparkles className="size-4 text-accent" />
            <p className="mt-2 text-sm font-semibold">A small tip</p>
            <p className="mt-1 text-sm text-muted">
              Profiles with a photo, a two-line bio and 3–5 links get noticeably more clicks.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
