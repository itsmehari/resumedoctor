// WBS 11.5 – Feature usage tracking
import { prisma } from "@/lib/prisma";

export type Feature = "ai" | "ats" | "export" | "cover_letter" | "import";

export async function recordFeatureUsage(
  userId: string,
  feature: Feature,
  meta?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    await prisma.featureUsageLog.create({
      data: { userId, feature, meta: meta ?? undefined },
    });
  } catch {
    // Non-critical – never throw
  }
}

export async function getFeatureUsageStats(since?: Date): Promise<{
  totals: Record<string, number>;
  daily: Array<{ date: string; feature: string; count: number }>;
}> {
  const from = since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await prisma.featureUsageLog.groupBy({
    by: ["feature"],
    where: { createdAt: { gte: from } },
    _count: true,
  });

  const totals: Record<string, number> = {};
  for (const r of rows) {
    totals[r.feature] = r._count;
  }

  return { totals, daily: [] };
}
