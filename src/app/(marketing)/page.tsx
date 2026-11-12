import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Eye,
  Globe2,
  GripVertical,
  Link2,
  Music2,
  Palette,
  Play,
  Share2,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnalyticsPreview } from "@/components/marketing/analytics-preview";
import { BuilderDemo } from "@/components/marketing/builder-demo";
import { HeroShowcase } from "@/components/marketing/hero-showcase";
import { ThemeGallery } from "@/components/marketing/theme-gallery";
import { CopyButton } from "@/components/copy-button";
import { ProfilePreview } from "@/components/profile-preview";
import { PlatformIcon } from "@/components/social-icons";
import { PLANS } from "@/lib/plans";
import {
  THEME_PRESETS,
  miniButtonStyle,
  presetSwatchStyle,
  type ThemePresetKey,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

const sampleLinks = [
  { title: "Latest print drop", description: "Six new risograph pieces" },
  { title: "Portfolio & case studies", description: "Selected client work" },
];

const sampleSocials = [
  { platform: "instagram" },
  { platform: "x" },
  { platform: "youtube" },
  { platform: "spotify" },
];

const audience = [
  "Illustrators",
  "Musicians",
  "Photographers",
  "Developers",
  "Writers",
  "Studios",
  "Coaches",
  "Small shops",
  "Podcasters",
  "Designers",
];

const socialPlatforms = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "github",
  "twitch",
  "spotify",
  "linkedin",
  "facebook",
  "pinterest",
];

const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Most people publish in under five minutes. Pick a username, add a display name and one link, then share it. Themes, widgets and socials are optional polish you can add any time.",
  },
  {
    question: "Do I need a credit card?",
    answer:
      "No. The free plan is genuinely free: one profile, unlimited basic links, a real theme and basic analytics. No payment details required.",
  },
  {
    question: "Can I change the layout after publishing?",
    answer:
      "Yes. Drag widgets into a new order, hide sections, switch themes and edit links whenever you like. Your public page updates as soon as you save.",
  },
  {
    question: "What analytics do you collect?",
    answer:
      "Views, link clicks, estimated unique visitors, device type and referrer hostname — no tracking cookies and no personal profiles. It is first-party measurement built for reading, not surveillance.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Custom domains are planned for the Business plan but are not part of the first release. Your LinkNest URL works everywhere in the meantime.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="grid-lines mask-fade-b pointer-events-none absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-48 size-[560px] rounded-full bg-[#ffd9c7] opacity-60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-24 size-[500px] rounded-full bg-[#e6d5ff] opacity-60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 size-[440px] rounded-full bg-[#c9f5e7] opacity-50 blur-3xl"
        />

        <div className="container-page relative grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:pb-28 lg:pt-20">
          <div className="relative">
            <Link
              href="/#builder"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/80 py-1.5 pl-2 pr-3.5 text-xs font-medium shadow-sm backdrop-blur transition hover:border-ink/25 hover:bg-surface"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-foreground">
                <Sparkles className="size-3" />
                New
              </span>
              Widgets, embeds &amp; ten themes
              <ArrowUpRight className="size-3.5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <h1 className="mt-6 font-serif text-[2.9rem] leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]">
              All of you,
              <br />
              in{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic">one link</span>
                <svg
                  aria-hidden
                  viewBox="0 0 220 12"
                  fill="none"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 z-0 h-3 w-full"
                >
                  <path
                    d="M2 8C42 3 84 2 124 5C156 7 186 9 218 4"
                    stroke="#ff5d73"
                    strokeOpacity="0.55"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              A link-in-bio that finally feels like your work. Compose your page from widgets,
              dress it in one of ten considered themes, and see exactly what your audience clicks.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(23,22,15,0.8)] transition hover:-translate-y-0.5 hover:bg-ink/90"
              >
                Claim your link
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#builder"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 bg-surface/70 px-5 text-sm font-semibold backdrop-blur transition hover:bg-surface"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-ink text-white">
                  <Play className="size-3 fill-current" />
                </span>
                See it in action
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              {["Free forever plan", "No credit card", "Publish in minutes"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-success" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-4 border-t border-border/70 pt-5">
              <div className="flex -space-x-2" aria-hidden>
                {(["minimal", "gradient", "creative", "terminal"] as ThemePresetKey[]).map((key) => (
                  <span
                    key={key}
                    className="size-8 rounded-full border-2 border-background shadow-sm"
                    style={{ background: THEME_PRESETS[key].theme.accentColor }}
                  />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted">
                <span className="font-semibold text-foreground">10 themes</span> · 9 widget types · 13
                socials
                <br />
                one page that finally looks like you.
              </p>
            </div>
          </div>

          <HeroShowcase />
        </div>
      </section>

      {/* Audience marquee */}
      <section className="border-y border-border/70 bg-surface/50">
        <div className="container-page py-5">
          <div className="mask-fade-x overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-8 text-sm text-muted">
              {[...audience, ...audience].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  aria-hidden={index >= audience.length}
                  className="inline-flex items-center gap-8"
                >
                  <span className="whitespace-nowrap">{item}</span>
                  <span aria-hidden className="text-accent/60">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature bento */}
      <section className="container-page py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              The toolkit
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              A link page with range.
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-muted">
              Links are table stakes. LinkNest gives you a stage — themes, widgets, embeds and
              analytics that feel considered, not bolted on.
            </p>
            <Link
              href="/features"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
            >
              Explore every feature
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <FeatureCard
            className="lg:col-span-4"
            icon={GripVertical}
            eyebrow="Page builder"
            title="Drag, drop, done."
            body="Reorder any section with a drag. Hide what you don't need. The phone preview keeps up as you go — no save-and-refresh guessing."
          >
            <div className="mt-5 rounded-2xl border border-border/80 bg-background/70 p-3">
              {[
                { icon: UserRoundIcon, label: "Profile header" },
                { icon: Link2, label: "Links" },
                { icon: Music2, label: "Music" },
              ].map(({ icon: Icon, label }, index) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-border/70 bg-surface px-2.5 py-2",
                    index > 0 && "mt-1.5",
                  )}
                >
                  <GripVertical className="size-3.5 text-muted/60" />
                  <span className="flex size-7 items-center justify-center rounded-lg bg-surface-muted">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="text-[11px] font-medium">{label}</span>
                  <Eye className="ml-auto size-3.5 text-muted/70" />
                </div>
              ))}
              <div className="mt-1.5 flex h-9 items-center justify-center rounded-xl border border-dashed border-ink/20 text-[10px] font-medium text-muted">
                Drop a widget here
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={Palette}
            eyebrow="Themes"
            title="Ten looks, one click."
            body="Paper, Noir, Aurora, Pop, Terminal and more — each with real type, texture and button treatments."
          >
            <div className="mt-5 grid grid-cols-2 gap-2">
              {(["minimal", "gradient", "creative", "terminal"] as ThemePresetKey[]).map((key) => {
                const theme = THEME_PRESETS[key].theme;
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-black/10 p-2 shadow-sm"
                    style={presetSwatchStyle(theme)}
                  >
                    <p className="truncate text-[7px] font-semibold">Mima Sánchez</p>
                    <span
                      className="mt-1 block h-1 w-8 rounded-full"
                      style={{ background: theme.textColor, opacity: 0.4 }}
                    />
                    <span
                      className="mt-2 block rounded px-1 py-1 text-center text-[6px] font-semibold"
                      style={miniButtonStyle(theme)}
                    >
                      {THEME_PRESETS[key].label}
                    </span>
                  </div>
                );
              })}
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={BarChart3}
            eyebrow="Analytics"
            title="Know what lands."
            body="Views, clicks and click-through in plain language — plus which links actually earn attention."
          >
            <div className="mt-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">12,480</p>
                  <p className="text-[10px] text-muted">views this month</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  +38%
                </span>
              </div>
              <div className="mt-3 flex h-12 items-end gap-1" aria-hidden>
                {[34, 52, 44, 64, 56, 80, 70, 94].map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className={cn(
                      "flex-1 rounded-sm",
                      index === 7 ? "bg-accent" : "bg-ink/10",
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={Music2}
            eyebrow="Embeds"
            title="Video and music, inline."
            body="Paste a YouTube, Vimeo or Spotify link. We turn it into a clean player — never a raw iframe."
          >
            <div className="mt-5 space-y-1.5">
              {[
                { icon: Play, label: "Studio tour", meta: "YouTube · 12 min" },
                { icon: Music2, label: "Studio playlist", meta: "Spotify · 24 tracks" },
              ].map(({ icon: Icon, label, meta }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface px-2.5 py-2"
                >
                  <span className="flex size-7 items-center justify-center rounded-lg bg-ink text-white">
                    <Icon className="size-3.5 fill-current" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-medium">{label}</span>
                    <span className="block text-[9px] text-muted">{meta}</span>
                  </span>
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={Share2}
            eyebrow="Socials"
            title="Every platform, one row."
            body="Thirteen networks with consistent icons, labels and link tracking."
          >
            <div className="mt-5 flex flex-wrap gap-1.5">
              {socialPlatforms.slice(0, 8).map((platform) => (
                <span
                  key={platform}
                  className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-surface text-foreground"
                >
                  <PlatformIcon platform={platform} className="size-3" />
                </span>
              ))}
              <span className="flex size-7 items-center justify-center rounded-full border border-dashed border-border text-[9px] font-medium text-muted">
                +5
              </span>
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={Smartphone}
            eyebrow="Performance"
            title="Fast where it counts."
            body="Mobile-first, semantic and accessible. No heavy page builder slowing down your link."
          >
            <div className="mt-5 flex items-center gap-3">
              <span className="flex size-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-emerald-500/20 bg-emerald-50 text-emerald-700">
                <span className="text-lg font-semibold leading-none">100</span>
                <span className="text-[7px] font-semibold uppercase tracking-wider">score</span>
              </span>
              <div className="space-y-1 text-[10px] text-muted">
                {["Performance", "Accessibility", "SEO"].map((item) => (
                  <p key={item} className="inline-flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={Globe2}
            eyebrow="Sharing"
            title="A preview worth clicking."
            body="Open Graph cards, canonical URLs and clean metadata, ready for every bio."
          >
            <div className="mt-5 overflow-hidden rounded-xl border border-border/70 bg-surface">
              <div className="h-10 bg-gradient-to-r from-[#ffe4ee] via-[#f6dcea] to-[#e6d5ff]" />
              <div className="px-2.5 py-2">
                <p className="text-[10px] font-semibold">Mima Sánchez — Illustrator</p>
                <p className="mt-0.5 text-[9px] text-muted">linknest.com/mima</p>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            icon={Sparkles}
            eyebrow="Pricing"
            title="Start at zero."
            body="Unlimited basic links, a real theme and analytics — free forever. Upgrade only when you need more."
          >
            <div className="mt-5 rounded-xl border border-border/70 bg-surface p-3">
              <p className="font-serif text-2xl">$0</p>
              <p className="text-[10px] text-muted">forever · no card</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                <Check className="size-3" />
                One profile, unlimited links
              </p>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* Builder */}
      <section id="builder" className="relative scroll-mt-16 overflow-hidden bg-ink py-20 text-white lg:py-28">
        <div aria-hidden className="absolute inset-0 opacity-[0.07]">
          <div className="grid-lines size-full" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 size-[420px] rounded-full bg-[#7c5cff]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 size-[380px] rounded-full bg-[#7cf2d4]/20 blur-3xl"
        />

        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              The page builder
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              Build it like a
              <br />
              moodboard.
              <span className="mt-2 block font-serif text-xl italic leading-none text-white/40 sm:text-2xl">
                Not a form.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              Stack a header, links, socials, text, media and calls to action. Drag them into place
              and watch the page rearrange itself. It is the rare editor that is actually fun.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                {
                  icon: GripVertical,
                  title: "Drag to reorder",
                  body: "Grab any section and drop it where you want.",
                },
                {
                  icon: Eye,
                  title: "Show or hide",
                  body: "Keep sections in reserve without deleting them.",
                },
                {
                  icon: Zap,
                  title: "Instant publish",
                  body: "Saved changes appear on your live page immediately.",
                },
                {
                  icon: Sparkles,
                  title: "Nine widget types",
                  body: "Header, links, socials, text, image, video, music, CTA, divider.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <Icon className="size-4 text-[#7cf2d4]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/50">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/signup"
              className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Try the builder
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <BuilderDemo />
        </div>
      </section>

      {/* Analytics */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute right-0 top-20 size-[420px] rounded-full bg-[#c9f5e7] opacity-40 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Analytics
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Numbers you can read at a glance.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              No dashboards to decode. See which links earn attention, where people come from and
              what they use — collected first-party, without tracking cookies.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "Views and estimated unique visitors",
                "Clicks, click-through rate and top links",
                "Devices and referrer hostnames",
                "Cookieless by default — no personal profiles",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/features"
              className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
            >
              See what gets measured
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[38px] bg-gradient-to-tr from-accent/20 via-transparent to-[#7c5cff]/20 blur-2xl" />
            <AnalyticsPreview />
            <div className="absolute -bottom-4 left-6 hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-[10px] font-medium shadow-lg sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              First-party · cookieless
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section id="themes" className="scroll-mt-16 border-y border-border/70 bg-surface/50 py-16 lg:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Themes
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
                Ten themes. Then make it yours.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-muted">
                Every preset exposes the details: background, type, accent, button style, shadow,
                texture and avatar shape. Start with a look and bend it until it looks like nobody
                else&apos;s.
              </p>
              <Link
                href="/signup"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                Open the theme editor
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <ThemeGallery />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "10 presets",
              "4 typefaces",
              "4 button styles",
              "3 textures",
              "Card & open layouts",
              "Custom backgrounds",
              "Avatar shapes",
              "Any CSS color",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Share anywhere
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              One URL.
              <br />
              Every bio you own.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Put the same link in Instagram, TikTok, YouTube, X and your email signature. Change
              the page once; it updates everywhere. No more hunting for six separate link lists.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {socialPlatforms.slice(0, 6).map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium capitalize"
                >
                  <PlatformIcon platform={platform} className="size-3.5" />
                  {platform === "x" ? "X" : platform}
                </span>
              ))}
            </div>

            <Link
              href="/signup"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink/90"
            >
              Claim your URL
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[42px] bg-gradient-to-tr from-[#ffe4ee] via-transparent to-[#e6d5ff] blur-2xl"
            />
            <div className="overflow-hidden rounded-[26px] border border-border bg-surface shadow-[0_35px_70px_-35px_rgba(23,22,15,0.5)]">
              <div className="flex items-center gap-2 border-b border-border bg-surface-muted/60 px-3 py-2.5">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2 rounded-full bg-[#ff5f57]" />
                  <span className="size-2 rounded-full bg-[#febc2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                </span>
                <div className="mx-1 flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-muted">
                  <Globe2 className="size-3 shrink-0" />
                  <span className="truncate">linknest.com/yourname</span>
                </div>
                <CopyButton
                  value="https://link-in-bio-six-self.vercel.app/yourname"
                  label="Copy"
                />
              </div>
              <div className="bg-gradient-to-b from-surface-muted/60 to-surface p-3 sm:p-5">
                <div className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-sm">
                  <div className="h-[420px] overflow-hidden">
                    <ProfilePreview
                      displayName="Mima Sánchez"
                      username="mima"
                      bio="Illustrator & printmaker. Small things, made slowly."
                      links={sampleLinks}
                      socials={sampleSocials}
                      theme={THEME_PRESETS.bloom.theme}
                      showBranding={false}
                      compact
                      className="h-full min-h-full rounded-none border-0 shadow-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 rotate-2 rounded-xl border border-border bg-surface px-3 py-2 text-[10px] font-semibold shadow-lg">
              Same link, everywhere ✦
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="border-y border-border/70 bg-surface/50 py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Plans</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                Free to start. Fair when you grow.
              </h2>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
            >
              Compare plans
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {PLANS.map((plan) => {
              const dark = plan.recommended;
              return (
                <div
                  key={plan.key}
                  className={cn(
                    "relative flex flex-col rounded-[24px] border p-5 sm:p-6",
                    dark
                      ? "border-ink bg-ink text-white shadow-xl"
                      : "border-border bg-surface",
                  )}
                >
                  {dark ? (
                    <span className="absolute -top-3 left-5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
                      Recommended
                    </span>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-sm font-semibold", dark && "text-white")}>
                      {plan.name}
                    </h3>
                    {plan.key === "FREE" ? (
                      <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] font-medium text-muted">
                        No card
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3">
                    <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>{" "}
                    <span className={cn("text-xs", dark ? "text-white/50" : "text-muted")}>
                      {plan.cadence}
                    </span>
                  </p>
                  <p
                    className={cn(
                      "mt-2 min-h-10 text-xs leading-relaxed",
                      dark ? "text-white/55" : "text-muted",
                    )}
                  >
                    {plan.description}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs">
                        <Check
                          className={cn(
                            "mt-0.5 size-3.5 shrink-0",
                            dark ? "text-[#7cf2d4]" : "text-success",
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.key === "FREE" ? "/signup" : "/pricing"}
                    className={cn(
                      "mt-5 inline-flex h-10 items-center justify-center rounded-full text-xs font-semibold transition",
                      dark
                        ? "bg-white text-ink hover:bg-white/90"
                        : "border border-border bg-surface hover:bg-surface-muted",
                    )}
                  >
                    {plan.key === "FREE" ? "Start for free" : `See ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted">
            Start free today. Paid plans are shown for comparison while payments are being finalized.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">FAQ</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              The short answers.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Still curious? The full list lives on the FAQ page — or just start free and see for
              yourself.
            </p>
            <Link
              href="/faq"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
            >
              Read all questions
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                  {faq.question}
                  <span className="shrink-0 text-lg text-muted transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white sm:px-12 lg:py-20">
          <div aria-hidden className="absolute inset-0 opacity-[0.08]">
            <div className="grid-lines size-full" />
          </div>
          <div
            aria-hidden
            className="animate-float pointer-events-none absolute -left-16 top-0 size-64 rounded-full bg-[#7c5cff]/30 blur-3xl"
          />
          <div
            aria-hidden
            className="animate-float-delayed pointer-events-none absolute -right-10 bottom-0 size-72 rounded-full bg-accent/25 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 select-none font-serif text-[9rem] leading-none text-white/[0.04] sm:text-[13rem]"
          >
            linknest
          </span>

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Ready when you are
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl">
              Your next link deserves a better home.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              Claim your URL, pick a theme, and publish a page that feels like you in about five
              minutes. Free to start, no card required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition hover:-translate-y-0.5 hover:bg-accent/90"
              >
                Claim your link
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/#themes"
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse the themes
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/45">
              {["Free forever plan", "No credit card", "Cancel any time"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-[#7cf2d4]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  className,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(23,22,15,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_45px_-32px_rgba(23,22,15,0.5)] sm:p-6",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-surface-muted">
          <Icon className="size-4" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
      {children}
    </div>
  );
}

function UserRoundIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.7-3.4 3.4-5.5 7-5.5s6.3 2.1 7 5.5" />
    </svg>
  );
}
