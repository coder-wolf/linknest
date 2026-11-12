import type { CSSProperties } from "react";
import { z } from "zod";

export const FONT_OPTIONS = [
  { key: "sans", label: "Modern sans", stack: "var(--font-geist-sans)" },
  { key: "grotesk", label: "Space Grotesk", stack: "var(--font-grotesk)" },
  { key: "serif", label: "Playfair serif", stack: "var(--font-playfair)" },
  { key: "mono", label: "Geist mono", stack: "var(--font-geist-mono)" },
] as const;

export type FontKey = (typeof FONT_OPTIONS)[number]["key"];

export const SHAPE_OPTIONS = [
  { key: "rounded", label: "Rounded", radius: "14px" },
  { key: "pill", label: "Pill", radius: "999px" },
  { key: "square", label: "Square", radius: "4px" },
] as const;

export type ButtonShape = (typeof SHAPE_OPTIONS)[number]["key"];

export const BUTTON_STYLES = [
  { key: "solid", label: "Solid", description: "Filled, high contrast" },
  { key: "outline", label: "Outline", description: "Hairline border, transparent" },
  { key: "glass", label: "Glass", description: "Frosted, translucent" },
  { key: "soft", label: "Soft", description: "Tinted, low contrast" },
] as const;

export type ButtonStyle = (typeof BUTTON_STYLES)[number]["key"];

export const SHADOW_OPTIONS = [
  { key: "none", label: "Flat" },
  { key: "soft", label: "Soft" },
  { key: "hard", label: "Offset" },
] as const;

export type ShadowKey = (typeof SHADOW_OPTIONS)[number]["key"];

export const TEXTURE_OPTIONS = [
  { key: "none", label: "Clean" },
  { key: "noise", label: "Grain" },
  { key: "grid", label: "Grid" },
  { key: "dots", label: "Dots" },
] as const;

export type TextureKey = (typeof TEXTURE_OPTIONS)[number]["key"];

export const AVATAR_SHAPES = [
  { key: "circle", label: "Circle" },
  { key: "squircle", label: "Squircle" },
  { key: "square", label: "Square" },
] as const;

export type AvatarShape = (typeof AVATAR_SHAPES)[number]["key"];

export type LayoutKey = "classic" | "card";

export type ThemePresetKey =
  | "minimal"
  | "dark"
  | "gradient"
  | "creative"
  | "sand"
  | "cobalt"
  | "sage"
  | "riso"
  | "terminal"
  | "bloom";

export const THEME_PRESET_KEYS = [
  "minimal",
  "dark",
  "gradient",
  "creative",
  "sand",
  "cobalt",
  "sage",
  "riso",
  "terminal",
  "bloom",
] as const;

export type Theme = {
  preset: ThemePresetKey | "custom";
  background: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  buttonColor: string;
  buttonTextColor: string;
  cardColor: string;
  buttonStyle: ButtonStyle;
  buttonShape: ButtonShape;
  shadow: ShadowKey;
  font: FontKey;
  layout: LayoutKey;
  texture: TextureKey;
  avatarShape: AvatarShape;
  backgroundImageUrl: string | null;
};

export const THEME_PRESETS: Record<
  ThemePresetKey,
  { label: string; description: string; theme: Theme }
> = {
  minimal: {
    label: "Paper",
    description: "Warm stock, ink type and a whisper of grain.",
    theme: {
      preset: "minimal",
      background: "#f7f3ea",
      textColor: "#17150f",
      mutedColor: "#6e675a",
      accentColor: "#b4442f",
      buttonColor: "#17150f",
      buttonTextColor: "#fbf7ee",
      cardColor: "#fffdf7",
      buttonStyle: "solid",
      buttonShape: "rounded",
      shadow: "soft",
      font: "serif",
      layout: "classic",
      texture: "noise",
      avatarShape: "circle",
      backgroundImageUrl: null,
    },
  },
  dark: {
    label: "Noir",
    description: "Charcoal gradients, frosted buttons, electric lime.",
    theme: {
      preset: "dark",
      background: "radial-gradient(120% 80% at 50% 0%, #1b1b22 0%, #08080a 60%)",
      textColor: "#f6f4ef",
      mutedColor: "#9b97a5",
      accentColor: "#d4ff4f",
      buttonColor: "#ffffff",
      buttonTextColor: "#f6f4ef",
      cardColor: "#141419",
      buttonStyle: "glass",
      buttonShape: "rounded",
      shadow: "none",
      font: "grotesk",
      layout: "classic",
      texture: "grid",
      avatarShape: "squircle",
      backgroundImageUrl: null,
    },
  },
  gradient: {
    label: "Aurora",
    description: "A deep aurora mesh with frosted glass and mint.",
    theme: {
      preset: "gradient",
      background:
        "radial-gradient(120% 100% at 12% 0%, #2b1b5e 0%, transparent 55%), radial-gradient(120% 100% at 88% 8%, #0b4f5c 0%, transparent 48%), linear-gradient(165deg, #0f0a24 0%, #191038 48%, #2a0f3d 100%)",
      textColor: "#f4eeff",
      mutedColor: "#b8a9dd",
      accentColor: "#7cf2d4",
      buttonColor: "#ffffff",
      buttonTextColor: "#1a1030",
      cardColor: "rgba(255, 255, 255, 0.06)",
      buttonStyle: "glass",
      buttonShape: "pill",
      shadow: "soft",
      font: "grotesk",
      layout: "card",
      texture: "noise",
      avatarShape: "squircle",
      backgroundImageUrl: null,
    },
  },
  creative: {
    label: "Pop",
    description: "Near-black canvas, coral punch and offset shadows.",
    theme: {
      preset: "creative",
      background: "#0e0c12",
      textColor: "#fff4ea",
      mutedColor: "#b6a8b0",
      accentColor: "#ff5d73",
      buttonColor: "#ff5d73",
      buttonTextColor: "#1a0d10",
      cardColor: "#17131c",
      buttonStyle: "solid",
      buttonShape: "pill",
      shadow: "hard",
      font: "grotesk",
      layout: "classic",
      texture: "dots",
      avatarShape: "circle",
      backgroundImageUrl: null,
    },
  },
  sand: {
    label: "Sand",
    description: "Sun-bleached neutrals and a framed editorial card.",
    theme: {
      preset: "sand",
      background: "#ebe0cf",
      textColor: "#3a2f23",
      mutedColor: "#7c6d5a",
      accentColor: "#a8672f",
      buttonColor: "#3a2f23",
      buttonTextColor: "#f9f3e7",
      cardColor: "#f6efe2",
      buttonStyle: "solid",
      buttonShape: "rounded",
      shadow: "soft",
      font: "serif",
      layout: "card",
      texture: "none",
      avatarShape: "squircle",
      backgroundImageUrl: null,
    },
  },
  cobalt: {
    label: "Cobalt",
    description: "Saturated blue, crisp white and a yellow accent.",
    theme: {
      preset: "cobalt",
      background: "linear-gradient(180deg, #2450e6 0%, #1836a8 100%)",
      textColor: "#f8faff",
      mutedColor: "#c4d2ff",
      accentColor: "#ffd84d",
      buttonColor: "#ffffff",
      buttonTextColor: "#14215c",
      cardColor: "rgba(255, 255, 255, 0.12)",
      buttonStyle: "solid",
      buttonShape: "pill",
      shadow: "hard",
      font: "grotesk",
      layout: "classic",
      texture: "grid",
      avatarShape: "circle",
      backgroundImageUrl: null,
    },
  },
  sage: {
    label: "Sage",
    description: "Quiet botanical greens with tinted soft buttons.",
    theme: {
      preset: "sage",
      background: "#e6ecdf",
      textColor: "#1f2d1c",
      mutedColor: "#5c6d57",
      accentColor: "#4d7a4f",
      buttonColor: "#2c4630",
      buttonTextColor: "#f3f8ee",
      cardColor: "#f5f9f0",
      buttonStyle: "soft",
      buttonShape: "rounded",
      shadow: "none",
      font: "sans",
      layout: "card",
      texture: "none",
      avatarShape: "squircle",
      backgroundImageUrl: null,
    },
  },
  riso: {
    label: "Riso",
    description: "Print-studio cream with tomato ink and hard edges.",
    theme: {
      preset: "riso",
      background: "#f4eee4",
      textColor: "#181a30",
      mutedColor: "#5a5c78",
      accentColor: "#e04a2f",
      buttonColor: "#e04a2f",
      buttonTextColor: "#fff8f0",
      cardColor: "#fff9f0",
      buttonStyle: "solid",
      buttonShape: "square",
      shadow: "hard",
      font: "grotesk",
      layout: "classic",
      texture: "dots",
      avatarShape: "square",
      backgroundImageUrl: null,
    },
  },
  terminal: {
    label: "Terminal",
    description: "Phosphor green on black, monospaced and boxed.",
    theme: {
      preset: "terminal",
      background: "#05100a",
      textColor: "#b9f6c9",
      mutedColor: "#5f9b70",
      accentColor: "#3dff8a",
      buttonColor: "#0c2316",
      buttonTextColor: "#b9f6c9",
      cardColor: "#081a10",
      buttonStyle: "outline",
      buttonShape: "square",
      shadow: "none",
      font: "mono",
      layout: "classic",
      texture: "grid",
      avatarShape: "square",
      backgroundImageUrl: null,
    },
  },
  bloom: {
    label: "Bloom",
    description: "Powder-pink glow with a soft serif and glass cards.",
    theme: {
      preset: "bloom",
      background:
        "radial-gradient(110% 90% at 18% 0%, #ffe4ee 0%, transparent 58%), linear-gradient(160deg, #fdf3f7 0%, #f6dcea 55%, #edd4e8 100%)",
      textColor: "#4a2039",
      mutedColor: "#8a5f7b",
      accentColor: "#d23f7a",
      buttonColor: "#ffffff",
      buttonTextColor: "#4a2039",
      cardColor: "rgba(255, 255, 255, 0.66)",
      buttonStyle: "glass",
      buttonShape: "pill",
      shadow: "soft",
      font: "serif",
      layout: "card",
      texture: "noise",
      avatarShape: "circle",
      backgroundImageUrl: null,
    },
  },
};

export const DEFAULT_THEME: Theme = THEME_PRESETS.minimal.theme;

const cssColor = z
  .string()
  .trim()
  .min(1)
  .max(400)
  .refine((value) => !/url\s*\(|;|<|>/i.test(value), "Unsupported color value");

export const themeSchema = z.object({
  preset: z.enum([...THEME_PRESET_KEYS, "custom"]),
  background: cssColor,
  textColor: cssColor,
  mutedColor: cssColor,
  accentColor: cssColor,
  buttonColor: cssColor,
  buttonTextColor: cssColor,
  cardColor: cssColor,
  buttonStyle: z.enum(["solid", "outline", "glass", "soft"]),
  buttonShape: z.enum(["rounded", "pill", "square"]),
  shadow: z.enum(["none", "soft", "hard"]),
  font: z.enum(["sans", "grotesk", "serif", "mono"]),
  layout: z.enum(["classic", "card"]),
  texture: z.enum(["none", "noise", "grid", "dots"]),
  avatarShape: z.enum(["circle", "squircle", "square"]),
  backgroundImageUrl: z.string().trim().max(2048).nullable(),
});

export function isThemePresetKey(value: string): value is ThemePresetKey {
  return (THEME_PRESET_KEYS as readonly string[]).includes(value);
}

/**
 * Themes saved before a field existed are upgraded from their preset rather
 * than discarded, so older profiles keep their look.
 */
export function parseTheme(value: unknown): Theme {
  if (!value || typeof value !== "object") return DEFAULT_THEME;

  const raw = value as Record<string, unknown>;
  const preset =
    typeof raw.preset === "string" && isThemePresetKey(raw.preset)
      ? THEME_PRESETS[raw.preset].theme
      : DEFAULT_THEME;

  const result = themeSchema.safeParse({ ...preset, ...raw });
  return result.success ? result.data : preset;
}

export function fontStack(font: FontKey) {
  return FONT_OPTIONS.find((option) => option.key === font)?.stack ?? FONT_OPTIONS[0].stack;
}

export function shapeRadius(shape: ButtonShape) {
  return SHAPE_OPTIONS.find((option) => option.key === shape)?.radius ?? "14px";
}

export function avatarRadius(shape: AvatarShape) {
  if (shape === "square") return "12px";
  if (shape === "squircle") return "32%";
  return "999px";
}

/** `color-mix` keeps a single theme color usable at any opacity. */
export function mix(color: string, percent: number) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export function readableOn(color: string, fallback = "#0b0b0e") {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return fallback;

  const hex = match[1];
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => character + character)
          .join("")
      : hex;

  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16) / 255);
  const channel = (value: number) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  const luminance = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

  return luminance > 0.45 ? "#0b0b0e" : "#fbfaf6";
}

export function shadowValue(theme: Theme) {
  if (theme.shadow === "hard") return `4px 4px 0 0 ${theme.textColor}`;
  if (theme.shadow === "soft") return "0 14px 30px -18px rgba(0, 0, 0, 0.55)";
  return "none";
}

export function buttonStyle(theme: Theme): CSSProperties {
  const base: CSSProperties = {
    borderRadius: shapeRadius(theme.buttonShape),
    boxShadow: shadowValue(theme),
    transition: "transform 150ms ease, filter 150ms ease, background-color 150ms ease",
  };

  switch (theme.buttonStyle) {
    case "outline":
      return {
        ...base,
        background: "transparent",
        color: theme.textColor,
        border: `1.5px solid ${mix(theme.buttonColor, 55)}`,
      };
    case "glass":
      return {
        ...base,
        background: mix(theme.buttonColor, 16),
        color: theme.buttonTextColor,
        border: `1px solid ${mix(theme.buttonColor, 32)}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      };
    case "soft":
      return {
        ...base,
        background: mix(theme.buttonColor, 14),
        color: theme.textColor,
        border: `1px solid ${mix(theme.buttonColor, 24)}`,
      };
    default:
      return {
        ...base,
        background: theme.buttonColor,
        color: theme.buttonTextColor,
        border: "1px solid transparent",
      };
  }
}

export function cardStyle(theme: Theme): CSSProperties {
  return {
    background: theme.cardColor,
    border: `1px solid ${mix(theme.textColor, 14)}`,
    boxShadow: "0 28px 70px -34px rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };
}

const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export function textureStyle(theme: Theme): CSSProperties {
  switch (theme.texture) {
    case "grid":
      return {
        backgroundImage: `linear-gradient(to right, ${mix(theme.textColor, 8)} 1px, transparent 1px), linear-gradient(to bottom, ${mix(theme.textColor, 8)} 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      };
    case "dots":
      return {
        backgroundImage: `radial-gradient(${mix(theme.textColor, 16)} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      };
    case "noise":
      return {
        backgroundImage: NOISE_TEXTURE,
        backgroundRepeat: "repeat",
        opacity: 0.5,
        mixBlendMode: "overlay",
      };
    default:
      return {};
  }
}

/** Small swatch used in the theme picker so presets read at a glance. */
export function presetSwatchStyle(theme: Theme): CSSProperties {
  return {
    background: theme.background,
    color: theme.textColor,
  };
}

export function miniButtonStyle(theme: Theme): CSSProperties {
  return { ...buttonStyle(theme), boxShadow: "none" };
}
