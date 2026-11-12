import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms that govern your use of LinkNest.",
};

const sections = [
  {
    title: "Your account",
    body: "You must provide a valid email address and keep your credentials secure. You are responsible for activity under your account. One person or organisation per account unless a Business plan says otherwise.",
  },
  {
    title: "Your content",
    body: "You keep ownership of the content you add — links, text and images. You grant us the limited licence needed to host and display it on your public page. You must have the right to share everything you publish.",
  },
  {
    title: "Acceptable use",
    body: "No illegal content, malware, phishing, harassment, impersonation, spam, or attempts to break, overload or reverse-engineer the service. We may remove content or suspend accounts that put other users at risk.",
  },
  {
    title: "Plans and billing",
    body: "The free plan is free. Paid plans are billed monthly in advance and renew automatically until cancelled. Payments are not enabled in this release; when they are, prices and taxes will be shown before purchase.",
  },
  {
    title: "Availability",
    body: "We aim for high availability but do not guarantee uninterrupted service. Maintenance, abuse mitigation or upstream outages may cause downtime. Keep your own copy of anything you cannot afford to lose.",
  },
  {
    title: "Termination",
    body: "You can delete your account at any time. We may suspend or terminate accounts that violate these terms. On termination, your public page stops being served and data is handled according to our privacy policy.",
  },
  {
    title: "Liability",
    body: "The service is provided as-is. To the extent permitted by law, we are not liable for indirect or consequential damages, or for lost profits or data. Nothing here limits rights you have under applicable consumer law.",
  },
  {
    title: "Changes",
    body: "We may update these terms as the product evolves. Material changes will be announced by email before they take effect.",
  },
];

export default function TermsPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Legal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">Terms of service</h1>
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
          Questions about these terms?{" "}
          <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
