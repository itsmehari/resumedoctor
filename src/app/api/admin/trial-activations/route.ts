// WBS 10.6 – Admin: list & approve trial activation requests
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [pending, history] = await Promise.all([
    prisma.trialActivationRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.trialActivationRequest.findMany({
      where: { status: { in: ["approved", "rejected"] } },
      orderBy: { reviewedAt: "desc" },
      take: 50,
    }),
  ]);
  return NextResponse.json({ requests: pending, history });
}
