// WBS 6.6 – AI response cache (DB-backed, 24h TTL)
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function makeHash(action: string, input: unknown): string {
  const raw = JSON.stringify({ action, input });
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function getCachedAiResponse<T>(
  action: string,
  input: unknown
): Promise<T | null> {
  const hash = makeHash(action, input);
  try {
    const cached = await prisma.aiResponseCache.findUnique({ where: { hash } });
    if (!cached) return null;
    if (cached.expiresAt < new Date()) {
      await prisma.aiResponseCache.delete({ where: { hash } }).catch(() => {});
      return null;
    }
    return cached.response as T;
  } catch {
    return null;
  }
}

export async function setCachedAiResponse(
  action: string,
  input: unknown,
  response: unknown
): Promise<void> {
  const hash = makeHash(action, input);
  const expiresAt = new Date(Date.now() + TTL_MS);
  try {
    await prisma.aiResponseCache.upsert({
      where: { hash },
      create: { hash, action, response: response as object, expiresAt },
      update: { response: response as object, expiresAt },
    });
  } catch {
    // Cache write failure is non-critical
  }
}

export async function purgeExpiredAiCache(): Promise<void> {
  await prisma.aiResponseCache.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
