// Admin – Subscription metrics, template usage, feature usage
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    usersByPlan,
    templateUsage,
    exportByFormat,
    proCount,
    freeCount,
    totalUsers,
    featureUsageByFeature,
    aiUsageByAction,
    totalAiUsage,
    totalAtsRuns,
  ] = await Promise.all([
    prisma.user.groupBy({ by: ["subscription"], _count: { id: true } }),
    prisma.resume.groupBy({ by: ["templateId"], _count: { id: true } }),
    prisma.exportLog.groupBy({ by: ["format"], _count: { id: true } }),
    prisma.user.count({ where: { subscription: { in: ["pro_monthly", "pro_annual"] } } }),
    prisma.user.count({ where: { subscription: "free" } }),
    prisma.user.count(),
    prisma.featureUsageLog.groupBy({
      by: ["feature"],
      _count: true,
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.aiUsageLog.groupBy({
      by: ["action"],
      _count: true,
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.aiUsageLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.atsScoreCache.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const planBreakdown: Record<string, number> = {};
  for (const g of usersByPlan) {
    planBreakdown[g.subscription] = g._count.id;
  }

  const templateStats: Record<string, number> = {};
  for (const t of templateUsage) {
    templateStats[t.templateId] = t._count.id;
  }

  const exportStats: Record<string, number> = {};
  for (const e of exportByFormat) {
    exportStats[e.format] = e._count.id;
  }

  const featureTotals: Record<string, number> = {};
  for (const f of featureUsageByFeature) {
    featureTotals[f.feature] = f._count;
  }

  const aiByAction: Record<string, number> = {};
  for (const a of aiUsageByAction) {
    aiByAction[a.action] = a._count;
  }

  const conversionRate = totalUsers > 0 ? (proCount / totalUsers) * 100 : 0;

  return NextResponse.json({
    subscriptionMetrics: {
      proCount,
      freeCount,
      totalUsers,
      conversionRate: Math.round(conversionRate * 10) / 10,
      planBreakdown,
    },
    templateUsage: templateStats,
    featureUsage: {
      exports: exportStats,
      totalExports: Object.values(exportStats).reduce((a, b) => a + b, 0),
      last30Days: featureTotals,
      aiLast30Days: { total: totalAiUsage, byAction: aiByAction },
      atsLast30Days: totalAtsRuns,
    },
  });
}
