import { NextRequest, NextResponse } from "next/server";
import { consumeEmailVerificationToken } from "@/lib/email-verification";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const user = await consumeEmailVerificationToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url));
  }

  return NextResponse.redirect(
    new URL(`/verify-email?verified=1&email=${encodeURIComponent(user.email)}`, request.url),
  );
}
