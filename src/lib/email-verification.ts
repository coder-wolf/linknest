import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueEmailVerificationToken(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    }),
  ]);

  return token;
}

/**
 * Marks the token's user as verified and consumes every outstanding token for
 * that account. Returns the verified user, or null for invalid/expired tokens.
 */
export async function consumeEmailVerificationToken(token: string) {
  if (!token) return null;

  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      user: { select: { id: true, email: true, emailVerified: true } },
    },
  });

  if (!record) return null;

  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } });
    return null;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  return record.user;
}
