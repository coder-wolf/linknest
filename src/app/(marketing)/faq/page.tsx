import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about LinkNest profiles, links, themes and plans.",
};

const faqs = [
  {
    question: "What exactly is LinkNest?",
    answer:
      "A link-in-bio platform. You get one public page at linknest.com/yourname that holds all the links you want to share — socials, projects, shop, videos, bookings — with a design you control.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most people publish in under five minutes. Pick a username, add a display name and a first link, and you're done. Everything else is optional polish.",
  },
  {
    question: "Do I need a credit card for the free plan?",
    answer: "No. The free plan is genuinely free and doesn't ask for payment details.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Custom domains are a Business plan feature and are not available in the first release. Your LinkNest URL works everywhere in the meantime.",
  },
  {
    question: "Can I hide my page while I work on it?",
    answer:
      "Yes. New profiles start unpublished. Only you can preview an unpublished page. Publish and unpublish from your dashboard whenever you like.",
  },
  {
    question: "What analytics do you collect?",
    answer:
      "Page views, link clicks, estimated unique visitors, device type and referrer hostname. We don't use tracking cookies or store personal data for analytics.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, from Settings → Danger zone. Deleting removes your profile, links, social accounts and analytics permanently. This cannot be undone.",
  },
  {
    question: "Which social platforms are supported?",
    answer:
      "Instagram, Facebook, YouTube, TikTok, X, LinkedIn, GitHub, Pinterest, Twitch, Spotify, Discord, Telegram and WhatsApp.",
  },
  {
    question: "Is there an API?",
    answer:
      "Not yet. The product is focused on the core editor and public page first. An API is a candidate for a later release.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Badge>FAQ</Badge>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Questions, answered plainly.
        </h1>
        <p className="mt-3 text-muted">
          If something isn&apos;t here, write to us — we read everything.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
              {faq.question}
              <span className="shrink-0 text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-ink px-6 py-8 text-center text-white">
        <p className="font-serif text-2xl">Still curious?</p>
        <p className="mt-1 text-sm text-white/65">
          Try the free plan — it&apos;s the fastest way to see if LinkNest fits.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground"
          >
            Create my page
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-full border border-white/20 px-5 text-sm font-semibold"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
