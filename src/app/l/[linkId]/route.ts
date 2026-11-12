import { NextRequest, NextResponse } from "next/server";
import { trackClick } from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const { linkId } = await params;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const url = await trackClick({
    linkId,
    referrer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
    ip,
    appHost: request.nextUrl.host,
  });

  if (!url) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(url, 302);
}
