import Link from "next/link";
import { Logo } from "@/components/logo";
import { getSessionUser } from "@/lib/session";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <Link href="/features" className="transition hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="transition hover:text-foreground">
            Pricing
          </Link>
          <Link href="/#themes" className="transition hover:text-foreground">
            Themes
          </Link>
          <Link href="/faq" className="transition hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href={user.profile ? "/dashboard" : "/onboarding"}
              className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-10 items-center rounded-full px-4 text-sm font-medium text-muted transition hover:text-foreground sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
