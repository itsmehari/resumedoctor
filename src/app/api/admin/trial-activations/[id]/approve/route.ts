// WBS 10.6 – Admin: approve trial activation request
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const req = await prisma.trialActivationRequest.findUnique({ where: { id } });
  if (!req || req.status !== "pending") {
    return NextResponse.json({ error: "Request not found or already processed" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { email: req.email.toLowerCase() },
  });
  if (!user) {
    return NextResponse.json(
      { error: "No account found with this email. User must sign up first." },
      { status: 400 }
    );
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        subscription: "pro_trial_14",
        subscriptionExpiresAt: expiresAt,
      },
    }),
    prisma.trialActivationRequest.update({
      where: { id },
      data: { status: "approved", userId: user.id, reviewedBy: admin.email, reviewedAt: new Date() },
    }),
  ]);

  await logAdminAction({
    action: "admin_trial_activation_approve",
    adminUserId: admin.id,
    targetUserId: user.id,
    meta: { requestId: id, email: req.email },
  });

  return NextResponse.json({ success: true });
}
