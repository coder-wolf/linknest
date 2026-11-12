import { z } from "zod";

export const RESERVED_USERNAMES = new Set([
  "about",
  "admin",
  "api",
  "app",
  "auth",
  "billing",
  "blog",
  "contact",
  "dashboard",
  "docs",
  "faq",
  "features",
  "help",
  "home",
  "l",
  "login",
  "logout",
  "onboarding",
  "pricing",
  "privacy",
  "pro",
  "profile",
  "public",
  "reset-password",
  "settings",
  "signup",
  "support",
  "terms",
  "upgrade",
  "www",
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be 30 characters or fewer")
  .regex(/^[a-z0-9_-]+$/, "Use letters, numbers, hyphens and underscores only")
  .refine((value) => !value.startsWith("-") && !value.endsWith("-"), {
    message: "Username cannot start or end with a hyphen",
  })
  .refine((value) => !RESERVED_USERNAMES.has(value), {
    message: "That username is reserved",
  });

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be 100 characters or fewer");

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(60, "Display name must be 60 characters or fewer");

export const bioSchema = z
  .string()
  .trim()
  .max(280, "Bio must be 280 characters or fewer");

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const httpUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL is too long")
  .refine(isHttpUrl, "Enter a valid http(s) URL");

export const linkSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(80, "Title is too long"),
  url: httpUrlSchema,
  description: z.string().trim().max(160, "Description is too long").optional(),
});

export const socialSchema = z.object({
  platform: z.string().trim().min(1, "Choose a platform").max(40),
  url: httpUrlSchema,
});

export const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "x", label: "X (Twitter)" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "pinterest", label: "Pinterest" },
  { key: "twitch", label: "Twitch" },
  { key: "spotify", label: "Spotify" },
  { key: "discord", label: "Discord" },
  { key: "telegram", label: "Telegram" },
  { key: "whatsapp", label: "WhatsApp" },
] as const;

export type PlatformKey = (typeof PLATFORMS)[number]["key"];
