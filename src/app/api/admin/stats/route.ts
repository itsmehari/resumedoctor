// Admin – Dashboard stats
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsers, totalResumes, totalExports, usersByPlan, recentSignups, trialCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.exportLog.count(),
      prisma.user.groupBy({
        by: ["subscription"],
        _count: { id: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, email: true, name: true, createdAt: true, subscription: true },
      }),
      prisma.user.count({ where: { subscription: "trial" } }),
    ]);

  const planBreakdown: Record<string, number> = {};
  for (const g of usersByPlan) {
    planBreakdown[g.subscription] = g._count.id;
  }

  return NextResponse.json({
    totalUsers,
    totalResumes,
    totalExports,
    planBreakdown,
    trialCount,
    recentSignups,
  });
}
