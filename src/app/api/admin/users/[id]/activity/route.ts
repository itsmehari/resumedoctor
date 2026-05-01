// Admin – merged activity timeline for a user (first-party logs)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const LIMIT = 120;

type TimelineItem = {
  at: string;
  kind: "product_event" | "feature_usage" | "export" | "ai_usage";
  label: string;
  detail?: Record<string, unknown>;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [productEvents, featureUsage, exports, aiUsage] = await Promise.all([
    prisma.productEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      select: { name: true, props: true, createdAt: true },
    }),
    prisma.featureUsageLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      select: { feature: true, meta: true, createdAt: true },
    }),
    prisma.exportLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      select: { format: true, resumeId: true, createdAt: true },
    }),
    prisma.aiUsageLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: LIMIT,
      select: { action: true, createdAt: true },
    }),
  ]);

  const items: TimelineItem[] = [];

  for (const e of productEvents) {
    items.push({
      at: e.createdAt.toISOString(),
      kind: "product_event",
      label: e.name,
      detail: e.props ? (e.props as Record<string, unknown>) : undefined,
    });
  }
  for (const f of featureUsage) {
    items.push({
      at: f.createdAt.toISOString(),
      kind: "feature_usage",
      label: f.feature,
      detail: f.meta ? (f.meta as Record<string, unknown>) : undefined,
    });
  }
  for (const x of exports) {
    items.push({
      at: x.createdAt.toISOString(),
      kind: "export",
      label: x.format,
      detail: { resumeId: x.resumeId },
    });
  }
  for (const a of aiUsage) {
    items.push({
      at: a.createdAt.toISOString(),
      kind: "ai_usage",
      label: a.action,
    });
  }

  items.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  const trimmed = items.slice(0, LIMIT);

  return NextResponse.json({ items: trimmed });
}
