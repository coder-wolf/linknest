import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Eye, MousePointerClick, Users } from "lucide-react";
import { AnalyticsChart, BreakdownBar } from "@/components/dashboard/analytics-chart";
import { Badge, Card, CardBody, CardHeader, EmptyState } from "@/components/ui/card";
import { getAnalytics } from "@/lib/analytics";
import { requireProfile } from "@/lib/session";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

const RANGES = [7, 30, 90] as const;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const requested = Number(params.range);
  const days = RANGES.includes(requested as (typeof RANGES)[number]) ? requested : 7;

  const { profile } = await requireProfile();
  const analytics = await getAnalytics(profile.id, days);

  const stats = [
    { label: "Profile views", value: formatNumber(analytics.views), icon: Eye },
    { label: "Unique visitors", value: formatNumber(analytics.uniqueVisitors), icon: Users },
    { label: "Link clicks", value: formatNumber(analytics.clicks), icon: MousePointerClick },
    { label: "Click-through rate", value: `${(analytics.ctr * 100).toFixed(1)}%`, icon: BarChart3 },
  ];

  const deviceTotal = analytics.devices.reduce((sum, item) => sum + item.count, 0);
  const hasData = analytics.views > 0 || analytics.clicks > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted">
            A simple read on how people find you and what they tap.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
          {RANGES.map((range) => (
            <Link
              key={range}
              href={`/dashboard/analytics?range=${range}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                days === range ? "bg-ink text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {range} days
            </Link>
          ))}
        </div>
      </div>

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
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Traffic over time</h2>
            <p className="text-xs text-muted">Views and clicks per day.</p>
          </div>
          <Badge>Last {days} days</Badge>
        </CardHeader>
        <CardBody>
          {hasData ? (
            <AnalyticsChart daily={analytics.daily} />
          ) : (
            <EmptyState
              title="No traffic yet"
              description="Once your page is published and shared, views and clicks will show up here."
            />
          )}
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold">Top performing links</h2>
            <p className="text-xs text-muted">Ranked by clicks in this period.</p>
          </CardHeader>
          <CardBody>
            {analytics.topLinks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No link clicks yet.</p>
            ) : (
              <div className="space-y-2">
                {analytics.topLinks.map((link, index) => {
                  const max = analytics.topLinks[0]?.clicks || 1;
                  return (
                    <div key={link.id} className="flex items-center gap-3">
                      <span className="w-4 shrink-0 text-xs text-muted">{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">{link.title}</p>
                          <span className="shrink-0 text-xs text-muted">{link.clicks}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${(link.clicks / max) * 100}%` }}
                          />
                        </div>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-foreground"
                        aria-label={`Open ${link.title}`}
                      >
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Devices</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {analytics.devices.length === 0 ? (
                <p className="text-sm text-muted">No views yet.</p>
              ) : (
                analytics.devices.map((device) => (
                  <BreakdownBar
                    key={device.device}
                    label={device.device}
                    value={device.count}
                    total={deviceTotal}
                  />
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Traffic sources</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {analytics.referrers.length === 0 ? (
                <p className="text-sm text-muted">No referrers yet.</p>
              ) : (
                analytics.referrers.map((referrer) => (
                  <div
                    key={referrer.source}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span className="truncate">{referrer.source}</span>
                    <span className="text-xs text-muted">{referrer.count}</span>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted">
        Analytics are first-party and cookie-free. Unique visitors are estimated from a daily
        rotating hash, not stored personal data.
      </p>
    </div>
  );
}
