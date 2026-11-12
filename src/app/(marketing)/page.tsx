import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Link2,
  Palette,
  Search,
  Share2,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { ProfilePreview } from "@/components/profile-preview";
import { Badge, Card } from "@/components/ui/card";
import { THEME_PRESETS, type ThemePresetKey } from "@/lib/themes";

const sampleLinks = [
  { title: "Latest print drop", description: "Six new risograph pieces" },
  { title: "Portfolio & case studies", description: "Selected client work" },
  { title: "Watch the studio tour", description: "12 minutes, very cozy" },
  { title: "Book a commission", description: "Two slots open this month" },
];

const sampleSocials = [
  { platform: "instagram" },
  { platform: "x" },
  { platform: "youtube" },
  { platform: "spotify" },
];

const features = [
  {
    icon: Link2,
    title: "Every link, one page",
    body: "Add, edit, reorder and hide links with a drag. No code, no clutter, no digging through menus.",
  },
  {
    icon: Palette,
    title: "Looks like you, not us",
    body: "Preset themes, custom colors, gradients, fonts and button shapes. Your page should feel like your work.",
  },
  {
    icon: BarChart3,
    title: "Analytics you can read",
    body: "Views, clicks, click-through rate, top links, devices and referrers — without a spreadsheet.",
  },
  {
    icon: Share2,
    title: "All your socials",
    body: "Thirteen platforms, one tidy icon row. Instagram, YouTube, TikTok, GitHub, Spotify and more.",
  },
  {
    icon: Smartphone,
    title: "Fast on every phone",
    body: "Mobile-first by default, with semantic HTML and accessible contrast. Most visitors arrive on a phone.",
  },
  {
    icon: Search,
    title: "Ready to be shared",
    body: "SEO metadata, Open Graph previews and a clean canonical URL for every profile.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-0 size-[520px] rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 size-[420px] rounded-full bg-[#7c5cff]/10 blur-3xl" />

        <div className="container-page grid items-center gap-14 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-24">
          <div className="relative">
            <Badge tone="accent" className="gap-1.5">
              <Sparkles className="size-3.5" />
              Free forever plan · no credit card
            </Badge>

            <h1 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              One home for
              <br />
              every link you
              <span className="relative mx-2 inline-block">
                <span className="relative z-10">share.</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-accent/50" />
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              LinkNest turns your scattered profiles, projects and products into one beautiful,
              customizable page — ready for your bio in under five minutes.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                Claim your link <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/#themes"
                className="inline-flex h-12 items-center rounded-full border border-border bg-surface px-6 text-sm font-semibold transition hover:bg-surface-muted"
              >
                See the themes
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              {["No code needed", "Publish in minutes", "Cancel any time"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-4 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="absolute -inset-8 rounded-[56px] bg-gradient-to-tr from-accent/25 via-transparent to-[#7c5cff]/20 blur-2xl" />
            <div className="relative rounded-[44px] border-[10px] border-ink bg-ink shadow-2xl">
              <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
              <ProfilePreview
                displayName="Mima Sánchez"
                username="mima"
                bio="Illustrator & printmaker. Small things, made slowly."
                links={sampleLinks}
                socials={sampleSocials}
                theme={THEME_PRESETS.gradient.theme}
                className="rounded-[32px] border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/60">
        <div className="container-page grid gap-6 py-10 sm:grid-cols-3">
          {[
            { title: "Built for creators", body: "Artists, streamers, writers, freelancers." },
            { title: "Made for small teams", body: "Shops, studios and independent brands." },
            { title: "Yours to shape", body: "Themes, colors, fonts and layout." },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-0.5 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Everything you need
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            A link-in-bio that doesn&apos;t look like everyone else&apos;s.
          </h2>
          <p className="mt-3 text-muted">
            Start simple. Grow into something that feels genuinely yours.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-surface-muted">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface/60 py-16 lg:py-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Three steps
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                From signup to shared in five minutes.
              </h2>
              <p className="mt-3 text-muted">
                No onboarding maze. Pick a username, add your first link, publish.
              </p>

              <ol className="mt-8 space-y-6">
                {[
                  {
                    title: "Claim your link",
                    body: "Choose a username. Your page lives at linknest.com/yourname.",
                  },
                  {
                    title: "Make it yours",
                    body: "Add a photo, a short bio, your links and socials. Pick a theme.",
                  },
                  {
                    title: "Share everywhere",
                    body: "Publish and drop the link in every bio you own.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="mt-0.5 text-sm text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(Object.keys(THEME_PRESETS) as ThemePresetKey[]).map((key) => {
                const preset = THEME_PRESETS[key];
                return (
                  <div
                    key={key}
                    className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-sm"
                  >
                    <div
                      className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl px-3"
                      style={{
                        background: preset.theme.background,
                        color: preset.theme.textColor,
                      }}
                    >
                      <span className="text-[11px] font-semibold">{preset.label}</span>
                      <span
                        className="w-full py-1 text-center text-[9px] font-medium"
                        style={{
                          background: preset.theme.buttonColor,
                          color: preset.theme.buttonTextColor,
                          borderRadius:
                            preset.theme.buttonShape === "pill"
                              ? "999px"
                              : preset.theme.buttonShape === "square"
                                ? "2px"
                                : "8px",
                        }}
                      >
                        A link
                      </span>
                      <span
                        className="w-full py-1 text-center text-[9px] font-medium opacity-80"
                        style={{
                          background: preset.theme.buttonColor,
                          color: preset.theme.buttonTextColor,
                          borderRadius:
                            preset.theme.buttonShape === "pill"
                              ? "999px"
                              : preset.theme.buttonShape === "square"
                                ? "2px"
                                : "8px",
                        }}
                      >
                        Another
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="themes" className="container-page scroll-mt-20 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Themes
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              Start from a look. Then make it unrecognizable.
            </h2>
            <p className="mt-3 text-muted">
              Five presets, or mix your own background, text, button colors, type and shape. Pro
              unlocks the more expressive combinations.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Try the editor <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:mt-8">
              <ProfilePreview
                displayName="Mima Sánchez"
                username="mima"
                bio="Illustrator & printmaker."
                links={sampleLinks.slice(0, 2)}
                socials={sampleSocials.slice(0, 3)}
                theme={THEME_PRESETS.minimal.theme}
              />
            </div>
            <div>
              <ProfilePreview
                displayName="Mima Sánchez"
                username="mima"
                bio="Illustrator & printmaker."
                links={sampleLinks.slice(0, 2)}
                socials={sampleSocials.slice(0, 3)}
                theme={THEME_PRESETS.creative.theme}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                Your corner of the internet is waiting.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/65 sm:text-base">
                Free to start, free to stay. Bring your links, pick a theme, and share one URL
                everywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
              >
                Create my page <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
