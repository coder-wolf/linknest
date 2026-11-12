import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { DashboardNav } from "@/components/dashboard/nav";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/card";
import { requireProfile } from "@/lib/session";
import { initials } from "@/lib/utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireProfile();
  const plan = user.subscription?.plan ?? "FREE";

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface/70 px-3 py-5 lg:flex">
        <div className="px-2">
          <Logo href="/dashboard" />
        </div>

        <DashboardNav className="mt-8" />

        <div className="mt-auto space-y-4 px-1">
          {plan === "FREE" ? (
            <div className="rounded-2xl bg-ink p-4 text-white">
              <Sparkles className="size-5 text-accent" />
              <p className="mt-2 text-sm font-semibold">Make it unmistakably yours</p>
              <p className="mt-1 text-xs text-white/65">
                Remove branding, unlock advanced themes and deeper analytics.
              </p>
              <Link
                href="/dashboard/billing"
                className="mt-3 inline-flex text-xs font-semibold text-accent hover:underline"
              >
                Explore Pro →
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-4">
              <Badge tone="accent">{plan} plan</Badge>
              <p className="mt-2 text-xs text-muted">Thanks for supporting LinkNest.</p>
            </div>
          )}

          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold">
              {initials(profile.displayName || profile.username)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{profile.displayName}</p>
              <p className="truncate text-xs text-muted">@{profile.username}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg px-2 py-1 text-xs text-muted transition hover:bg-surface-muted hover:text-foreground"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-5 sm:px-8">
            <div className="lg:hidden">
              <Logo href="/dashboard" />
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              {profile.isPublished ? (
                <Badge tone="success">Live</Badge>
              ) : (
                <Badge tone="warning">Unpublished</Badge>
              )}
              <span className="text-sm text-muted">
                linknest.com/<span className="font-medium text-foreground">{profile.username}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-medium transition hover:bg-surface-muted"
              >
                View page
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
          <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
            <DashboardNav className="px-1" />
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 lg:py-9">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
