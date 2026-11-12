import { ArrowUpRight, Monitor, Smartphone, Tablet } from "lucide-react";

const topLinks = [
  { label: "Latest print drop", value: 38 },
  { label: "Portfolio & case studies", value: 27 },
  { label: "Watch the studio tour", value: 19 },
  { label: "Book a commission", value: 11 },
];

const stats = [
  { label: "Clicks", value: "3,942" },
  { label: "Click rate", value: "31.6%" },
  { label: "Uniques", value: "8,210" },
];

export function AnalyticsPreview() {
  return (
    <div className="relative overflow-hidden rounded-[30px] bg-[#101014] p-5 text-white shadow-[0_45px_90px_-40px_rgba(16,16,20,0.8)] sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Analytics
          </p>
          <p className="mt-1 text-sm font-medium text-white/80">Last 30 days</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70">
          <span className="animate-pulse-dot size-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="relative mt-5 flex flex-wrap items-end gap-3">
        <span className="text-4xl font-semibold tracking-tight sm:text-5xl">12,480</span>
        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
          <ArrowUpRight className="size-3.5" />
          38.2%
        </span>
        <span className="mb-1.5 text-xs text-white/45">vs. previous period</span>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox="-8 0 576 160"
          preserveAspectRatio="none"
          className="h-36 w-full sm:h-44"
          role="img"
          aria-label="Views trending upward over the last 30 days"
        >
          <defs>
            <linearGradient id="landing-analytics-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7d8f" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff7d8f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110, 150].map((y) => (
            <line
              key={y}
              x1="0"
              x2="560"
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.07)"
              strokeDasharray="4 6"
            />
          ))}
          <path
            d="M0 132 C 36 126 52 104 82 108 S 126 132 158 112 S 196 78 226 86 S 268 108 296 82 S 340 46 372 56 S 418 74 448 48 S 502 22 540 30 S 556 26 560 24 L560 160 L0 160 Z"
            fill="url(#landing-analytics-fill)"
          />
          <path
            d="M0 132 C 36 126 52 104 82 108 S 126 132 158 112 S 196 78 226 86 S 268 108 296 82 S 340 46 372 56 S 418 74 448 48 S 502 22 540 30 S 556 26 560 24"
            fill="none"
            stroke="#ff8b9b"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="540" cy="30" r="4" fill="#ff5d73" stroke="#101014" strokeWidth="2.5" />
        </svg>
        <div className="mt-1 flex justify-between text-[9px] uppercase tracking-[0.14em] text-white/35">
          <span>Mar 1</span>
          <span>Mar 8</span>
          <span>Mar 15</span>
          <span>Mar 22</span>
          <span>Mar 30</span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">{stat.label}</p>
            <p className="mt-1 text-sm font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 border-t border-white/8 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Top links
          </p>
          <span className="text-[10px] text-white/35">clicks</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {topLinks.map((link) => (
            <div key={link.label}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-white/75">{link.label}</span>
                <span className="shrink-0 text-white/45">{link.value}%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${link.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-4 border-t border-white/8 pt-4 text-[10px] text-white/45">
        <span className="inline-flex items-center gap-1.5">
          <Smartphone className="size-3.5" /> Mobile 78%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Monitor className="size-3.5" /> Desktop 16%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Tablet className="size-3.5" /> Tablet 6%
        </span>
      </div>
    </div>
  );
}
