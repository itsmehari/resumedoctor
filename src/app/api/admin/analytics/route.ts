// Admin – Subscription metrics, template usage, feature usage
import { NextResponse } from "next/server";
import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const [
    usersByPlan,
    templateUsage,
    exportByFormat,
    proCount,
    basicCount,
    totalUsers,
    featureUsageByFeature,
    aiUsageByAction,
    totalAiUsage,
    totalAtsRuns,
    productEventFunnel,
  ] = await Promise.all([
    prisma.user.groupBy({ by: ["subscription"], _count: { id: true } }),
    prisma.resume.groupBy({ by: ["templateId"], _count: { id: true } }),
    prisma.exportLog.groupBy({ by: ["format"], _count: { id: true } }),
    prisma.user.count({ where: { subscription: { in: ["pro_monthly", "pro_annual"] } } }),
    prisma.user.count({ where: { subscription: { in: ["basic", "free"] } } }),
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
    prisma.productEvent.groupBy({
      by: ["name"],
      where: {
        createdAt: { gte: sevenDaysAgo },
        name: {
          in: [
            "sign_up",
            "resume_created",
            "trial_start",
            "checkout_started",
            "first_export",
            "payment_success",
            "onboarding_completed",
            "onboarding_step_completed",
          ],
        },
      },
      _count: true,
    }),
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

  const funnelLast7Days: Record<string, number> = {};
  for (const row of productEventFunnel) {
    funnelLast7Days[row.name] = row._count;
  }

  const cohortWeeks: Array<{ weekStart: string; signups: number; paid: number }> = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const weekEnd = addWeeks(weekStart, 1);
    const signups = await prisma.user.count({
      where: { createdAt: { gte: weekStart, lt: weekEnd } },
    });
    const cohortUsers = await prisma.user.findMany({
      where: { createdAt: { gte: weekStart, lt: weekEnd } },
      select: { id: true },
    });
    const ids = cohortUsers.map((u) => u.id);
    let paid = 0;
    if (ids.length > 0) {
      const paidRows = await prisma.productEvent.findMany({
        where: { userId: { in: ids }, name: "payment_success" },
        distinct: ["userId"],
        select: { userId: true },
      });
      paid = paidRows.length;
    }
    cohortWeeks.push({
      weekStart: weekStart.toISOString().slice(0, 10),
      signups,
      paid,
    });
  }

  return NextResponse.json({
    subscriptionMetrics: {
      proCount,
      basicCount,
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
    productEvents: {
      funnelLast7Days,
      cohortSignupToPaid: cohortWeeks,
    },
  });
}
