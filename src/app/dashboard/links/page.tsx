import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { LinkManager } from "./link-manager";

export const metadata: Metadata = { title: "My links" };

export default async function LinksPage() {
  const { profile } = await requireProfile();

  const links = await prisma.link.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" },
    select: {
      id: true,
      title: true,
      url: true,
      description: true,
      iconUrl: true,
      isActive: true,
      clicks: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My links</h1>
          <p className="text-sm text-muted">
            Everything visitors can tap, in the order they&apos;ll see it.
          </p>
        </div>
        <Link
          href={`/${profile.username}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          Preview page <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <LinkManager key={links.map((link) => link.id).join("-")} links={links} />
    </div>
  );
}
