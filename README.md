# LinkNest

A link-in-bio SaaS: one customizable public page for every link you share.

Built from the product requirements in [`PRD.md`](./PRD.md). This repository currently covers
Phases 1–4 of the MVP roadmap: authentication and onboarding, link and social management,
public profiles with themes, and first-party analytics.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Auth | Auth.js (NextAuth v5), credentials + JWT sessions |
| Icons | lucide-react, react-icons |
| Validation | Zod |

UI primitives are hand-rolled with Tailwind instead of shadcn/ui to keep the dependency surface
small. They live in `src/components/ui/` and follow the same composition pattern.

## Getting started

Requirements: Node 22+, pnpm, PostgreSQL 14+.

```bash
pnpm install

# 1. Create a database
createdb linknest

# 2. Configure environment
cp .env.example .env
# edit DATABASE_URL, set AUTH_SECRET (openssl rand -base64 32)

# 3. Push the schema and seed the demo account
pnpm db:push
pnpm db:seed

# 4. Run
pnpm dev
```

Demo login: `demo@linknest.com` / `password123` → public page at `/mima`.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Sync schema to the database |
| `pnpm db:migrate` | Create a migration |
| `pnpm db:seed` | Seed the demo account |
| `pnpm db:studio` | Prisma Studio |

## Routes

**Marketing:** `/`, `/features`, `/pricing`, `/faq`, `/about`, `/contact`, `/privacy`, `/terms`

**Auth:** `/signup`, `/login`, `/forgot-password`, `/reset-password`

**App:** `/onboarding`, `/dashboard`, `/dashboard/widgets`, `/dashboard/links`,
`/dashboard/appearance`, `/dashboard/socials`, `/dashboard/analytics`, `/dashboard/billing`,
`/dashboard/settings`

**Public:** `/:username`, tracked link redirects at `/l/:linkId`, tracking endpoint
`POST /api/track`

## What works

- Email/password signup, login, logout, persistent sessions, password reset
- Onboarding with username claim, profile details, first link and social account
- Profile editing, username changes, email and password changes, account deletion
- Link CRUD, show/hide, drag-and-drop and keyboard reordering, per-link clicks
- 13 social platforms with icons, reordering, show/hide
- Widget-based page builder: header, links, socials, text, image, video, music, CTA and divider
  blocks, reorderable by drag-and-drop or arrows, each with visibility and inline editing
- Ten theme presets (Paper, Noir, Aurora, Pop, Sand, Cobalt, Sage, Riso, Terminal, Bloom) with
  full control over colors, button style/shape, shadow, texture, avatar shape, font and layout
- Allowlisted embeds for YouTube, Vimeo and Spotify; raw iframe URLs are never rendered
- Live previews in onboarding, the appearance editor and the page builder
- Publish/unpublish with owner-only preview of unpublished pages
- Public pages with SEO/Open Graph metadata, responsive layout, branding on the free plan
- First-party analytics: views, estimated uniques, clicks, CTR, top links, devices, referrers,
  7/30/90-day ranges
- Input validation, ownership checks on every mutation, rate limits on auth and tracking

## Known gaps / next milestones

- **Payments** (Phase 5): billing page is informational; no Stripe integration yet.
- **Email delivery**: password reset links are logged to the server console; wire Resend/SES
  before launch. Email verification is not implemented.
- **Uploads**: avatars, link icons and background images are URLs, not file uploads. Add
  S3/Cloudinary and image validation next.
- **Analytics scale**: events are written inline. Move ingestion to a queue and aggregate for
  high traffic; the schema is already indexed for the common queries.
- **Rate limiting** is in-memory and per-instance. Swap for Redis/Upstash when running more than
  one instance.
- **Custom domains, multiple profiles, team features**: out of MVP scope per the PRD.
- **Automated tests**: none yet. Add Playwright for the core flows and Vitest for validation
  helpers.

## Project layout

```
prisma/
  schema.prisma        # User, Profile, Link, SocialAccount, Widget, AnalyticsEvent, Subscription
  seed.ts              # Demo account with widgets, theme and 14 days of analytics
src/
  app/
    (marketing)/       # Public marketing site
    (auth)/            # Login, signup, password reset + server actions
    dashboard/         # Authenticated app + per-section server actions
    [username]/        # Public profile page
    l/[linkId]/        # Click tracking redirect
    api/               # Auth.js handlers and view tracking
  components/          # UI primitives, profile canvas, dashboard managers
  lib/                 # Auth, Prisma, analytics, themes, widgets, embeds, validation
```

## Design decisions

- **Server Actions over API routes** for mutations: less client code, progressive enhancement,
  and authorization stays next to the data change.
- **JWT sessions** avoid a session table and keep the credentials flow simple. Swap to database
  sessions when adding OAuth providers.
- **Theme as validated JSON** on the profile rather than a separate table: themes are edited as a
  unit and read on every public page.
- **Widgets as ordered rows**: each widget stores its own validated JSON config, so the page
  builder can add, reorder and restyle sections without schema changes. The public page and both
  previews share one `ProfileCanvas` renderer, so what you see in the dashboard is what ships.
- **Generated, allowlisted embeds**: video and music widgets resolve YouTube, Vimeo and Spotify
  URLs into known embed origins instead of accepting arbitrary iframe markup.
- **Denormalized `Link.clicks`** alongside `AnalyticsEvent` so dashboards and link lists stay fast
  without scanning events.
- **Cookie-free analytics** with a daily rotating visitor hash, matching the privacy copy.
- **Cache Components disabled** in `next.config.ts`: the app is auth- and session-driven, so
  request-time rendering is the correct default here.

## Deployment notes

- Set `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL` in the host environment.
- Run `prisma migrate deploy` on release, then `pnpm build`.
- Public profiles can be cached at the CDN later; analytics writes are already decoupled through
  the tracking endpoint.
