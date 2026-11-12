import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { safeHostname } from "@/lib/utils";

export function detectDevice(userAgent: string | null | undefined) {
  if (!userAgent) return "desktop";
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(userAgent)) return "mobile";
  return "desktop";
}

export function hashVisitor(ip: string, userAgent: string | null | undefined) {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update(`${ip}|${userAgent ?? ""}|${day}`)
    .digest("hex")
    .slice(0, 32);
}

export function normalizeReferrer(referrer: string | null | undefined, appHost: string) {
  if (!referrer) return null;
  const host = safeHostname(referrer);
  if (host === "Direct" || host === appHost.replace(/^www\./, "")) return null;
  return host;
}

export async function trackView(input: {
  profileId: string;
  referrer?: string | null;
  userAgent?: string | null;
  ip: string;
  appHost: string;
}) {
  await prisma.analyticsEvent.create({
    data: {
      profileId: input.profileId,
      type: "VIEW",
      referrer: normalizeReferrer(input.referrer, input.appHost),
      device: detectDevice(input.userAgent),
      visitorId: hashVisitor(input.ip, input.userAgent),
    },
  });
}

export async function trackClick(input: {
  linkId: string;
  referrer?: string | null;
  userAgent?: string | null;
  ip: string;
  appHost: string;
}) {
  const link = await prisma.link.findUnique({
    where: { id: input.linkId },
    include: { profile: { select: { id: true, isPublished: true } } },
  });
  if (!link || !link.isActive || !link.profile.isPublished) return null;

  await prisma.$transaction([
    prisma.link.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }),
    prisma.analyticsEvent.create({
      data: {
        profileId: link.profile.id,
        linkId: link.id,
        type: "CLICK",
        referrer: normalizeReferrer(input.referrer, input.appHost),
        device: detectDevice(input.userAgent),
        visitorId: hashVisitor(input.ip, input.userAgent),
      },
    }),
  ]);

  return link.url;
}

export type DailyPoint = { date: string; views: number; clicks: number };

export type AnalyticsSummary = {
  views: number;
  uniqueVisitors: number;
  clicks: number;
  ctr: number;
  topLinks: Array<{ id: string; title: string; url: string; clicks: number }>;
  devices: Array<{ device: string; count: number }>;
  referrers: Array<{ source: string; count: number }>;
  daily: DailyPoint[];
};

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAnalytics(profileId: string, days: number): Promise<AnalyticsSummary> {
  const since = startOfDay(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000));

  const [views, uniqueRows, clicks, topGroups, deviceGroups, referrerGroups, dailyRows] =
    await Promise.all([
      prisma.analyticsEvent.count({
        where: { profileId, type: "VIEW", createdAt: { gte: since } },
      }),
      prisma.analyticsEvent.findMany({
        where: { profileId, type: "VIEW", createdAt: { gte: since }, visitorId: { not: null } },
        distinct: ["visitorId"],
        select: { visitorId: true },
      }),
      prisma.analyticsEvent.count({
        where: { profileId, type: "CLICK", createdAt: { gte: since } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["linkId"],
        where: {
          profileId,
          type: "CLICK",
          createdAt: { gte: since },
          linkId: { not: null },
        },
        _count: { linkId: true },
        orderBy: { _count: { linkId: "desc" } },
        take: 5,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["device"],
        where: { profileId, type: "VIEW", createdAt: { gte: since } },
        _count: { device: true },
        orderBy: { _count: { device: "desc" } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["referrer"],
        where: { profileId, type: "VIEW", createdAt: { gte: since } },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 5,
      }),
      prisma.$queryRaw<Array<{ day: Date; views: bigint; clicks: bigint }>>`
        SELECT date_trunc('day', "createdAt") AS day,
               COUNT(*) FILTER (WHERE "type" = 'VIEW') AS views,
               COUNT(*) FILTER (WHERE "type" = 'CLICK') AS clicks
        FROM "AnalyticsEvent"
        WHERE "profileId" = ${profileId} AND "createdAt" >= ${since}
        GROUP BY 1
        ORDER BY 1 ASC
      `,
    ]);

  const linkIds = topGroups.map((group) => group.linkId).filter((id): id is string => Boolean(id));
  const links = linkIds.length
    ? await prisma.link.findMany({
        where: { id: { in: linkIds } },
        select: { id: true, title: true, url: true },
      })
    : [];
  const linkMap = new Map(links.map((link) => [link.id, link]));

  const byDay = new Map(dailyRows.map((row) => [dayKey(row.day), row]));
  const daily: DailyPoint[] = [];
  for (let index = 0; index < days; index += 1) {
    const date = new Date(since.getTime() + index * 24 * 60 * 60 * 1000);
    const key = dayKey(date);
    const row = byDay.get(key);
    daily.push({
      date: key,
      views: row ? Number(row.views) : 0,
      clicks: row ? Number(row.clicks) : 0,
    });
  }

  return {
    views,
    uniqueVisitors: uniqueRows.length,
    clicks,
    ctr: views > 0 ? clicks / views : 0,
    topLinks: topGroups
      .map((group) => {
        const link = group.linkId ? linkMap.get(group.linkId) : undefined;
        if (!link) return null;
        return { ...link, clicks: group._count.linkId };
      })
      .filter((link): link is { id: string; title: string; url: string; clicks: number } =>
        Boolean(link),
      ),
    devices: deviceGroups.map((group) => ({
      device: group.device ?? "unknown",
      count: group._count.device,
    })),
    referrers: referrerGroups.map((group) => ({
      source: group.referrer ?? "Direct",
      count: group._count.referrer,
    })),
    daily,
  };
}
