import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Link2, Palette, Search, Share2, Smartphone } from "lucide-react";
import { ProfilePreview } from "@/components/profile-preview";
import { Badge, Card } from "@/components/ui/card";
import { THEME_PRESETS } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Link management, themes, social icons, analytics and fast public pages — everything LinkNest does.",
};

const groups = [
  {
    icon: Link2,
    title: "Links that stay organized",
    body: "Add, edit, hide and reorder links with drag-and-drop or keyboard arrows. Add a description, a thumbnail and click tracking to each one.",
    points: [
      "Unlimited links on every plan",
      "Drag-and-drop ordering",
      "Show or hide individual links",
      "Optional descriptions and icons",
      "Click tracking per link",
    ],
  },
  {
    icon: Palette,
    title: "Design that feels like you",
    body: "Start from a preset, then take over. Backgrounds, gradients, text and button colors, button shape, font and layout are all editable.",
    points: [
      "Five starting themes",
      "Solid or gradient backgrounds",
      "Custom background images",
      "Three typefaces",
      "Classic or framed card layout",
    ],
  },
  {
    icon: Share2,
    title: "Your socials, one row",
    body: "Thirteen supported platforms with matching icons. Reorder them, hide the ones you don't use, and keep the row tidy on mobile.",
    points: [
      "Instagram, TikTok, YouTube, X",
      "LinkedIn, GitHub, Pinterest",
      "Twitch, Spotify, Discord",
      "Telegram and WhatsApp",
      "New-tab links with rel=noreferrer",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics without the noise",
    body: "A clear read on what's working: views, unique visitors, clicks, click-through rate, top links, devices and traffic sources.",
    points: [
      "7, 30 and 90 day ranges",
      "Top performing links",
      "Device breakdown",
      "Referrer sources",
      "Cookie-free visitor estimates",
    ],
  },
  {
    icon: Smartphone,
    title: "Fast, responsive, accessible",
    body: "Most visitors arrive on a phone. Public pages are mobile-first, keyboard friendly and built on semantic HTML with sensible contrast.",
    points: [
      "Mobile-first layout",
      "Keyboard navigation",
      "Semantic markup",
      "Accessible color contrast",
      "Optimized for slow connections",
    ],
  },
  {
    icon: Search,
    title: "Ready to share",
    body: "Every profile gets a canonical URL, SEO title and description, and Open Graph metadata so link previews look right wherever they land.",
    points: [
      "Per-profile metadata",
      "Open Graph and Twitter cards",
      "Canonical URLs",
      "Custom 404 for unknown usernames",
      "Only published pages are public",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="container-page py-16 text-center lg:py-24">
        <Badge tone="accent">Built for the whole page</Badge>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl tracking-tight sm:text-5xl">
          Everything a link-in-bio needs. Nothing it doesn&apos;t.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          LinkNest is deliberately focused: one profile, great links, real customization, honest
          analytics. No widget maze, no upsell wall.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Start free <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center rounded-full border border-border bg-surface px-6 text-sm font-semibold transition hover:bg-surface-muted"
          >
            See pricing
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-surface/60 py-16 lg:py-20">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.title} className="p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-surface-muted">
                  <Icon className="size-5" />
                </span>
                <h2 className="mt-4 text-sm font-semibold">{group.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{group.body}</p>
                <ul className="mt-4 space-y-1.5">
                  {group.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-muted">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Live preview
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              See every change before it goes live.
            </h2>
            <p className="mt-3 text-muted">
              The editor previews your page in real time. Publish when it feels right, unpublish
              any time. Your draft never leaks to the public.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfilePreview
              displayName="Mima Sánchez"
              username="mima"
              bio="Illustrator & printmaker."
              links={[{ title: "Latest print drop" }, { title: "Portfolio" }]}
              socials={[{ platform: "instagram" }, { platform: "x" }]}
              theme={THEME_PRESETS.dark.theme}
            />
            <div className="sm:mt-10">
              <ProfilePreview
                displayName="Mima Sánchez"
                username="mima"
                bio="Illustrator & printmaker."
                links={[{ title: "Latest print drop" }, { title: "Portfolio" }]}
                socials={[{ platform: "instagram" }, { platform: "x" }]}
                theme={THEME_PRESETS.sand.theme}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
