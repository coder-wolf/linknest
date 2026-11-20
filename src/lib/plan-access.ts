import type { PlanKey } from "@/lib/plans";
import type { FontKey, Theme, ThemePresetKey } from "@/lib/themes";

export const FREE_THEME_PRESETS: readonly ThemePresetKey[] = [
  "minimal",
  "dark",
  "cobalt",
  "ember",
  "bloom",
  "sage",
  "riso",
];

export const FREE_FONTS: readonly FontKey[] = ["sans", "grotesk", "serif"];

export const ANALYTICS_RANGES = [7, 30, 90] as const;
export const FREE_ANALYTICS_DAYS = 7;

export const FREE_LINK_LIMIT = 10;
export const PAID_LINK_LIMIT = 200;

export const FREE_WIDGET_LIMIT = 6;
export const PAID_WIDGET_LIMIT = 24;

export function isPaidPlan(plan: PlanKey | string | null | undefined) {
  return plan === "PRO" || plan === "BUSINESS";
}

export function canUseThemePreset(plan: PlanKey | string | null | undefined, preset: ThemePresetKey) {
  return isPaidPlan(plan) || FREE_THEME_PRESETS.includes(preset);
}

export function canUseFont(plan: PlanKey | string | null | undefined, font: FontKey) {
  return isPaidPlan(plan) || FREE_FONTS.includes(font);
}

/** Returns a user-facing reason when a theme uses paid-only features. */
export function themeAccessIssue(
  theme: Theme,
  plan: PlanKey | string | null | undefined,
): string | null {
  if (isPaidPlan(plan)) return null;

  if (theme.preset !== "custom" && !FREE_THEME_PRESETS.includes(theme.preset)) {
    return "That theme is part of Pro. Choose a Free theme or upgrade to Pro.";
  }
  if (!FREE_FONTS.includes(theme.font)) {
    return "Geist Mono is part of Pro. Pick another font or upgrade to use it.";
  }

  return null;
}

export function analyticsDaysForPlan(
  plan: PlanKey | string | null | undefined,
  requested: number,
) {
  if (!isPaidPlan(plan)) return FREE_ANALYTICS_DAYS;
  return ANALYTICS_RANGES.includes(requested as (typeof ANALYTICS_RANGES)[number])
    ? requested
    : 7;
}

export function canUseAdvancedAnalytics(plan: PlanKey | string | null | undefined) {
  return isPaidPlan(plan);
}

export function canUseLinkIcons(plan: PlanKey | string | null | undefined) {
  return isPaidPlan(plan);
}

export function linkLimitForPlan(plan: PlanKey | string | null | undefined) {
  return isPaidPlan(plan) ? PAID_LINK_LIMIT : FREE_LINK_LIMIT;
}

export function widgetLimitForPlan(plan: PlanKey | string | null | undefined) {
  return isPaidPlan(plan) ? PAID_WIDGET_LIMIT : FREE_WIDGET_LIMIT;
}

export const UPGRADE_HREF = "/dashboard/billing";
