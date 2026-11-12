import { NextRequest, NextResponse } from "next/server";
import { trackView } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

const seen = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const profileId = typeof body?.profileId === "string" ? body.profileId : null;
  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  const ip = clientIp(request);
  const now = Date.now();
  const bucket = seen.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    seen.set(ip, { count: 1, resetAt: now + 60_000 });
  } else {
    bucket.count += 1;
    if (bucket.count > 120) {
      return new NextResponse(null, { status: 429 });
    }
  }

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { id: true, isPublished: true },
  });
  if (!profile || !profile.isPublished) {
    return new NextResponse(null, { status: 204 });
  }

  await trackView({
    profileId: profile.id,
    referrer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
    ip,
    appHost: request.nextUrl.host,
  });

  return new NextResponse(null, { status: 204 });
}
