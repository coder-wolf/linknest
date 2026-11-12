import type { DailyPoint } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function AnalyticsChart({ daily }: { daily: DailyPoint[] }) {
  const max = Math.max(1, ...daily.map((point) => Math.max(point.views, point.clicks)));
  const showEvery = daily.length > 30 ? 15 : daily.length > 14 ? 7 : 1;

  return (
    <div>
      <div className="flex h-40 items-end gap-[3px]">
        {daily.map((point, index) => (
          <div
            key={point.date}
            className="group relative flex h-full flex-1 items-end justify-center gap-[2px]"
            title={`${point.date} · ${point.views} views · ${point.clicks} clicks`}
          >
            <div
              className="w-1/2 max-w-[10px] rounded-t-sm bg-ink/20 transition group-hover:bg-ink/35"
              style={{ height: `${Math.max(2, (point.views / max) * 100)}%` }}
            />
            <div
              className="w-1/2 max-w-[10px] rounded-t-sm bg-accent transition group-hover:bg-accent/80"
              style={{ height: `${Math.max(2, (point.clicks / max) * 100)}%` }}
            />
            {index % showEvery === 0 ? (
              <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted">
                {point.date.slice(5).replace("-", "/")}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ink/25" /> Views
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent" /> Clicks
        </span>
      </div>
    </div>
  );
}

export function BreakdownBar({
  label,
  value,
  total,
  className,
}: {
  label: string;
  value: number;
  total: number;
  className?: string;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="capitalize text-foreground">{label}</span>
        <span className="text-xs text-muted">
          {value} · {percent}%
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn("h-full rounded-full bg-ink/70", className)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
