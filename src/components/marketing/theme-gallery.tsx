import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  THEME_PRESET_KEYS,
  THEME_PRESETS,
  avatarRadius,
  cardStyle,
  fontStack,
  miniButtonStyle,
  mix,
  presetSwatchStyle,
  textureStyle,
  type ThemePresetKey,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

export function ThemeGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {THEME_PRESET_KEYS.map((key) => (
        <ThemeTile key={key} preset={key} />
      ))}
    </div>
  );
}

function ThemeTile({ preset }: { preset: ThemePresetKey }) {
  const { label, description, theme } = THEME_PRESETS[preset];

  return (
    <Link
      href="/signup"
      aria-label={`Try the ${label} theme`}
      title={description}
      className="group relative overflow-hidden rounded-[22px] border border-border bg-surface p-1.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_30px_55px_-30px_rgba(23,22,15,0.55)]"
    >
      <div
        className="relative h-[228px] overflow-hidden rounded-[17px]"
        style={presetSwatchStyle(theme)}
      >
        {theme.texture !== "none" ? (
          <div aria-hidden className="pointer-events-none absolute inset-0" style={textureStyle(theme)} />
        ) : null}

        <div
          className="relative flex h-full flex-col p-3"
          style={{ fontFamily: fontStack(theme.font) }}
        >
          <div
            className={cn(
              "flex h-full flex-col items-center justify-center gap-1.5",
              theme.layout === "card" && "rounded-[14px] px-3 py-4",
            )}
            style={theme.layout === "card" ? cardStyle(theme) : undefined}
          >
            <span
              className="flex size-8 items-center justify-center text-[10px] font-semibold"
              style={{
                borderRadius: avatarRadius(theme.avatarShape),
                background: mix(theme.textColor, 14),
                border: `1px solid ${mix(theme.textColor, 18)}`,
                color: theme.textColor,
              }}
            >
              MS
            </span>

            <span className="text-[11px] font-semibold leading-tight">Mima Sánchez</span>
            <span className="text-[8px] leading-none" style={{ color: theme.mutedColor }}>
              @mima
            </span>

            <div className="mt-2 w-full space-y-1.5">
              {["Latest print drop", "Portfolio"].map((link) => (
                <span
                  key={link}
                  className="flex w-full items-center justify-center gap-1 px-2 py-1.5 text-center text-[8px] font-semibold"
                  style={miniButtonStyle(theme)}
                >
                  <span
                    className="size-1 rounded-full"
                    style={{ background: theme.accentColor }}
                    aria-hidden
                  />
                  {link}
                </span>
              ))}
            </div>

            <div className="mt-1.5 flex items-center gap-1" aria-hidden>
              {[0, 1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className="size-2.5 rounded-full"
                  style={{
                    background: mix(theme.textColor, 10),
                    border: `1px solid ${mix(theme.textColor, 18)}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span className="text-[11px] font-semibold">{label}</span>
        <ArrowUpRight className="size-3.5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}
