import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Badge, Card } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free, upgrade when you need more. LinkNest plans for creators, freelancers and small businesses.",
};

const faqs = [
  {
    question: "Is the free plan really free?",
    answer:
      "Yes. One public profile, unlimited basic links, basic themes and basic analytics, with a small LinkNest badge on your page.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Any time. Upgrades take effect immediately; downgrades at the end of your billing period.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Not yet. We're starting with monthly plans and will add annual billing once demand is clear.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "Your page stays live on the free plan. You keep your links, profile and analytics history.",
  },
];

export default function PricingPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Badge tone="accent">Free forever plan</Badge>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Simple pricing, honest limits.
        </h1>
        <p className="mt-3 text-muted">
          Start free. Upgrade when your page starts doing real work for you. No setup fees, no
          surprise charges.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.key}
            className={cn(
              "relative flex flex-col p-6",
              plan.recommended && "border-ink shadow-md",
            )}
          >
            {plan.recommended ? (
              <Badge tone="accent" className="absolute -top-3 left-6">
                Recommended
              </Badge>
            ) : null}
            <h2 className="text-sm font-semibold">{plan.name}</h2>
            <p className="mt-3">
              <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>{" "}
              <span className="text-sm text-muted">{plan.cadence}</span>
            </p>
            <p className="mt-2 text-sm text-muted">{plan.description}</p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={cn(
                "mt-6 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition",
                plan.recommended
                  ? "bg-ink text-white hover:bg-ink/90"
                  : "border border-border bg-surface hover:bg-surface-muted",
              )}
            >
              {plan.key === "FREE" ? "Start for free" : `Choose ${plan.name}`}
            </Link>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Prices are illustrative while we validate demand. Payments arrive in the next milestone.
      </p>

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center font-serif text-3xl tracking-tight">Questions, answered</h2>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                {faq.question}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-xl text-center">
        <p className="text-sm text-muted">
          Still deciding?{" "}
          <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
            Try the free plan
          </Link>{" "}
          — it takes about two minutes.
        </p>
      </div>
    </div>
  );
}
