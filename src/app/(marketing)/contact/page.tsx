import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Badge, Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LinkNest team.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <Badge>Contact</Badge>
        <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
          Tell us what&apos;s not working.
        </h1>
        <p className="mt-3 text-muted">
          Bug reports, feature requests, or a page that just looks off — we read every message.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <Mail className="size-5" />
            <h2 className="mt-3 text-sm font-semibold">Email</h2>
            <p className="mt-1 text-sm text-muted">Usually answered within two working days.</p>
            <a
              href="mailto:hello@linknest.com"
              className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
            >
              hello@linknest.com
            </a>
          </Card>

          <Card className="p-5">
            <MessageCircle className="size-5" />
            <h2 className="mt-3 text-sm font-semibold">Before you write</h2>
            <p className="mt-1 text-sm text-muted">
              Most questions are already answered in the FAQ — plans, publishing, analytics and
              deletion.
            </p>
            <Link
              href="/faq"
              className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
            >
              Read the FAQ
            </Link>
          </Card>
        </div>

        <Card className="mt-4 bg-surface-muted/60 p-5">
          <h2 className="text-sm font-semibold">Reporting a bug</h2>
          <p className="mt-1 text-sm text-muted">
            Include your username, what you expected, what happened, and the browser you used. A
            screenshot helps more than you&apos;d think.
          </p>
        </Card>
      </div>
    </div>
  );
}
