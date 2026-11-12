import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How LinkNest collects, uses and protects your data.",
};

const sections = [
  {
    title: "What we collect",
    body: "Account data (email address, hashed password), profile data you choose to publish (display name, username, bio, avatar URL, links, social accounts), and first-party analytics events (page views and link clicks).",
  },
  {
    title: "Analytics and cookies",
    body: "We do not use advertising cookies or third-party trackers. Public page analytics record the event type, referrer hostname, a coarse device category and a daily rotating visitor hash derived from IP and user agent. The hash is not stored with your account and cannot be used to identify a person across days.",
  },
  {
    title: "How we use data",
    body: "To operate your page, authenticate you, show you analytics, prevent abuse, and communicate about your account. We do not sell personal data.",
  },
  {
    title: "Where data lives",
    body: "Application data is stored in a PostgreSQL database. Uploaded images are not yet supported; profile images are referenced by URL you provide. Payment processing is not enabled in this release.",
  },
  {
    title: "Retention and deletion",
    body: "You can delete your account from Settings → Danger zone. Deletion removes your profile, links, social accounts and analytics. Backups may retain encrypted copies for a short period before rotation.",
  },
  {
    title: "Your rights",
    body: "You can access, correct or delete your data through the dashboard. For anything else, contact us at hello@linknest.com and we will respond within a reasonable period.",
  },
  {
    title: "Changes",
    body: "If this policy changes materially, we will notify account holders by email before the change takes effect.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">Privacy policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: November 2026</p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-semibold">{section.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          Questions?{" "}
          <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
