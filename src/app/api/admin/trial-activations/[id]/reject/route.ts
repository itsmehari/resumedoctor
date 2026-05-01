// Admin: reject trial activation request
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";

const bodySchema = z.object({
  reason: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const activation = await prisma.trialActivationRequest.findUnique({ where: { id } });
  if (!activation || activation.status !== "pending") {
    return NextResponse.json({ error: "Request not found or already processed" }, { status: 404 });
  }

  let reason: string | undefined;
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (parsed.success) reason = parsed.data.reason;
  } catch {
    /* empty body ok */
  }

  await prisma.trialActivationRequest.update({
    where: { id },
    data: {
      status: "rejected",
      reviewedBy: admin.email,
      reviewedAt: new Date(),
    },
  });

  await logAdminAction({
    action: "admin_trial_activation_reject",
    adminUserId: admin.id,
    meta: { requestId: id, email: activation.email, reason: reason ?? null },
  });

  return NextResponse.json({ success: true });
}
