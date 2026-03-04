// WBS 10.6 – Admin: list & approve trial activation requests
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pending = await prisma.trialActivationRequest.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ requests: pending });
}
