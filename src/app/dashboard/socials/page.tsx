import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireProfile } from "@/lib/session";
import { SocialManager } from "./social-manager";

export const metadata: Metadata = { title: "Social accounts" };

export default async function SocialsPage() {
  const { profile } = await requireProfile();

  const socials = await prisma.socialAccount.findMany({
    where: { profileId: profile.id },
    orderBy: { position: "asc" },
    select: { id: true, platform: true, url: true, isActive: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Social accounts</h1>
        <p className="text-sm text-muted">
          Show visitors where else they can find you, without crowding your links.
        </p>
      </div>

      <SocialManager key={socials.map((social) => social.id).join("-")} socials={socials} />
    </div>
  );
}
