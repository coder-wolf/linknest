import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Why LinkNest exists and what we're building toward.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <Badge>About LinkNest</Badge>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          A small, owned corner of the internet.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Social platforms are good at many things, but none of them are good at being home. Your
          work is spread across six apps, each with a different audience and a tiny bio field.
          LinkNest exists to give that work one calm, durable address.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="font-serif text-2xl tracking-tight">What we believe</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <li>
                <strong className="text-foreground">Simple beats clever.</strong> A page you can
                understand at a glance is worth more than a builder with a hundred panels.
              </li>
              <li>
                <strong className="text-foreground">Your page should look like you.</strong>{" "}
                Themes are a starting point, not a uniform. Color, type and shape should be yours
                to change.
              </li>
              <li>
                <strong className="text-foreground">Analytics should be legible.</strong> You
                should be able to answer &ldquo;what&apos;s working?&rdquo; without exporting
                anything.
              </li>
              <li>
                <strong className="text-foreground">Free should be useful.</strong> The free plan
                is a real product, not a demo with the good parts removed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl tracking-tight">Where we&apos;re going</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              LinkNest starts as a link-in-bio tool. Under the surface, it&apos;s being built as a
              flexible personal page: links today, richer sections and embeds later, always
              without turning into a full website builder.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl tracking-tight">Who it&apos;s for</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Illustrators, streamers, writers, developers, consultants, small shops and studios —
              anyone with more than one thing worth linking to.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Create your page
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-semibold transition hover:bg-surface-muted"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
