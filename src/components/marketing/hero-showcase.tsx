"use client";

import { useState } from "react";
import { Check, Link2, Music2, TrendingUp, Type } from "lucide-react";
import { PhoneFrame } from "@/components/marketing/phone-frame";
import { ProfilePreview } from "@/components/profile-preview";
import { THEME_PRESETS, type ThemePresetKey } from "@/lib/themes";
import { cn } from "@/lib/utils";

const sampleLinks = [
  { title: "Latest print drop", description: "Six new risograph pieces" },
  { title: "Portfolio & case studies", description: "Selected client work" },
  { title: "Book a commission", description: "Two slots open this month" },
];

const sampleSocials = [
  { platform: "instagram" },
  { platform: "x" },
  { platform: "youtube" },
  { platform: "spotify" },
];

const choices: Array<{ key: ThemePresetKey; label: string; dot: string }> = [
  { key: "bloom", label: "Bloom", dot: "#d23f7a" },
  { key: "gradient", label: "Aurora", dot: "#7cf2d4" },
  { key: "creative", label: "Pop", dot: "#ff5d73" },
  { key: "minimal", label: "Paper", dot: "#b4442f" },
  { key: "terminal", label: "Terminal", dot: "#3dff8a" },
];

const bars = [38, 54, 44, 68, 58, 82, 96];

export function HeroShowcase() {
  const [themeKey, setThemeKey] = useState<ThemePresetKey>("bloom");
  const theme = THEME_PRESETS[themeKey].theme;

  return (
    <div className="isolate relative mx-auto w-full max-w-[440px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_120deg,#ffd9c7,#e6d5ff,#c9f5e7,#ffe1ee,#ffd9c7)] opacity-70 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/15"
      />

      <div className="relative mx-auto w-[286px] sm:w-[302px]">
        <PhoneFrame statusColor={theme.textColor} width="w-full">
          <ProfilePreview
            displayName="Mima Sánchez"
            username="mima"
            bio="Illustrator & printmaker. Small things, made slowly."
            links={sampleLinks}
            socials={sampleSocials}
            theme={theme}
            showBranding={false}
            compact
            fullBleed
            safeArea
            className="h-full min-h-full rounded-none border-0 shadow-none"
          />
        </PhoneFrame>
      </div>

      <div className="animate-float absolute -left-24 top-20 z-20 hidden w-[158px] rounded-2xl border border-black/5 bg-white/90 p-3.5 shadow-[0_20px_45px_-20px_rgba(23,22,15,0.45)] backdrop-blur sm:block">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
          Views this week
        </p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <span className="text-2xl font-semibold tracking-tight">2,418</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            <TrendingUp className="size-3" />
            38%
          </span>
        </div>
        <div className="mt-3 flex h-9 items-end gap-1" aria-hidden>
          {bars.map((height, index) => (
            <span
              key={height + index}
              className={cn("flex-1 rounded-sm", index === bars.length - 1 ? "bg-accent" : "bg-ink/10")}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="animate-float-delayed absolute -right-20 bottom-24 z-20 hidden w-[154px] rounded-2xl border border-black/5 bg-white/90 p-3.5 shadow-[0_20px_45px_-20px_rgba(23,22,15,0.45)] backdrop-blur xl:block">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">Widgets</p>
          <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {[
            { icon: Link2, label: "Links" },
            { icon: Type, label: "Text block" },
            { icon: Music2, label: "Music" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-border/70 bg-surface px-2 py-1.5"
            >
              <Icon className="size-3.5 text-muted" />
              <span className="text-[10px] font-medium">{label}</span>
              <Check className="ml-auto size-3 text-emerald-600" />
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[9px] text-muted">Drag to reorder</p>
      </div>

      <div className="relative z-10 mt-8">
        <p className="mb-2 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
          Live preview · try a theme
        </p>
        <div className="mx-auto flex w-fit max-w-full items-center justify-center gap-0.5 rounded-full border border-border/80 bg-surface/85 p-1.5 shadow-[0_16px_40px_-24px_rgba(23,22,15,0.45)] backdrop-blur">
          {choices.map((choice) => {
            const active = themeKey === choice.key;
            return (
              <button
                key={choice.key}
                type="button"
                onClick={() => setThemeKey(choice.key)}
                aria-pressed={active}
                aria-label={`Preview the ${choice.label} theme`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full transition",
                  active
                    ? "bg-ink px-2.5 py-2 text-[10px] font-medium text-white shadow-sm sm:text-[11px]"
                    : "px-2 py-2 text-[11px] font-medium text-muted hover:bg-surface-muted hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className="size-2.5 rounded-full ring-1 ring-black/10"
                  style={{ background: choice.dot }}
                />
                <span className={cn(!active && "hidden sm:inline")}>{choice.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
