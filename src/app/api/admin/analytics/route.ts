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
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
    totalCoverLetters,
    totalJobApplications,
    churnFeedbackLast30d,
    superprofilePurchases,
    invoicePaidAgg,
    usersEmailVerified,
    usersEmailUnverified,
    pendingTrialActivations,
    productEventNamesLast7d,
    totalResumes,
    proTrialCount,
    onboardingCompletedLast30d,
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
    prisma.coverLetter.count(),
    prisma.jobApplication.count(),
    prisma.churnFeedback.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.superprofilePurchaseEvent.count(),
    prisma.invoice.aggregate({
      where: { status: "paid" },
      _count: true,
      _sum: { amount: true },
    }),
    prisma.user.count({ where: { emailVerified: { not: null } } }),
    prisma.user.count({ where: { emailVerified: null } }),
    prisma.trialActivationRequest.count({ where: { status: "pending" } }),
    prisma.productEvent.groupBy({
      by: ["name"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: true,
    }),
    prisma.resume.count(),
    prisma.user.count({ where: { subscription: "pro_trial_14" } }),
    prisma.productEvent.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        name: "onboarding_completed",
      },
    }),
  ]);

  const dauApproxRows = await prisma.productEvent.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: oneDayAgo }, userId: { not: null } },
    _count: true,
  });
  const dauApprox = dauApproxRows.length;

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

  const productEventVolumeLast7d: Record<string, number> = {};
  for (const row of productEventNamesLast7d) {
    productEventVolumeLast7d[row.name] = row._count;
  }

  const h24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const h168 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    signupsLast24h,
    signupsLast7d,
    signupsLast30d,
    invoiceByStatusRows,
    proTrialExpiring7d,
    proTrialExpiredStillMarked,
    churnByReasonRows,
    otpSendOk24h,
    otpSendFail24h,
    otpVerifyOk24h,
    otpVerifyFail24h,
  ] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: h24 } } }),
    prisma.user.count({ where: { createdAt: { gte: h168 } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.invoice.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.user.count({
      where: {
        subscription: "pro_trial_14",
        subscriptionExpiresAt: { gte: now, lte: in7 },
      },
    }),
    prisma.user.count({
      where: {
        subscription: "pro_trial_14",
        subscriptionExpiresAt: { lt: now },
      },
    }),
    prisma.churnFeedback.groupBy({
      by: ["reason"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
    prisma.otpAttempt.count({
      where: { type: "send", success: true, createdAt: { gte: h24 } },
    }),
    prisma.otpAttempt.count({
      where: { type: "send", success: false, createdAt: { gte: h24 } },
    }),
    prisma.otpAttempt.count({
      where: { type: "verify", success: true, createdAt: { gte: h24 } },
    }),
    prisma.otpAttempt.count({
      where: { type: "verify", success: false, createdAt: { gte: h24 } },
    }),
  ]);

  const invoiceByStatus: Record<string, number> = {};
  for (const row of invoiceByStatusRows) {
    invoiceByStatus[row.status] = row._count.id;
  }

  const churnByReasonLast30d: Record<string, number> = {};
  for (const row of churnByReasonRows) {
    churnByReasonLast30d[row.reason] = row._count;
  }

  const otpSendTotal = otpSendOk24h + otpSendFail24h;
  const otpVerifyTotal = otpVerifyOk24h + otpVerifyFail24h;

  return NextResponse.json({
    subscriptionMetrics: {
      proCount,
      basicCount,
      totalUsers,
      conversionRate: Math.round(conversionRate * 10) / 10,
      planBreakdown,
      proTrialCount,
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
      volumeByNameLast7Days: productEventVolumeLast7d,
    },
    masterAdminKpis: {
      totalResumes,
      totalCoverLetters,
      totalJobApplications,
      churnFeedbackLast30d,
      superprofilePurchases,
      invoicesPaidCount: invoicePaidAgg._count,
      invoicesPaidAmountPaise: invoicePaidAgg._sum.amount ?? 0,
      usersEmailVerified,
      usersEmailUnverified,
      pendingTrialActivations,
      dauApprox,
      onboardingCompletedLast30d,
      signupsLast24h,
      signupsLast7d,
      signupsLast30d,
      invoiceByStatus,
      proTrialExpiring7d,
      proTrialExpiredStillMarked,
      churnByReasonLast30d,
      otpLast24h: {
        sendSuccessRate: otpSendTotal > 0 ? Math.round((otpSendOk24h / otpSendTotal) * 1000) / 10 : null,
        verifySuccessRate:
          otpVerifyTotal > 0 ? Math.round((otpVerifyOk24h / otpVerifyTotal) * 1000) / 10 : null,
        sendAttempts: otpSendTotal,
        verifyAttempts: otpVerifyTotal,
      },
    },
  });
}
