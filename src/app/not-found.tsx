import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container-page flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <main className="container-page flex flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">404</p>
        <h1 className="mt-3 max-w-xl font-serif text-4xl tracking-tight sm:text-5xl">
          This page slipped out of the nest.
        </h1>
        <p className="mt-3 max-w-md text-muted">
          The username may be wrong, the page may have been unpublished, or the link may have
          changed.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Back home
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-semibold transition hover:bg-surface-muted"
          >
            Claim this username
          </Link>
        </div>
      </main>
    </div>
  );
}
