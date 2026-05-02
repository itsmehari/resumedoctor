// Admin – User detail, update
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: { select: { id: true, provider: true, providerAccountId: true, type: true } },
      sessions: { select: { id: true, expires: true } },
      resumes: {
        select: {
          id: true,
          title: true,
          templateId: true,
          updatedAt: true,
          _count: { select: { exportLogs: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
      exportLogs: {
        select: { id: true, format: true, createdAt: true, resumeId: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      invoices: {
        select: {
          id: true,
          plan: true,
          amount: true,
          currency: true,
          status: true,
          externalRef: true,
          pdfUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      superprofilePurchases: {
        select: {
          id: true,
          productKey: true,
          email: true,
          idempotencyKey: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

const updateSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  subscription: z.enum(["basic", "free", "trial", "pro_monthly", "pro_annual", "pro_trial_14"]).optional(),
  name: z.string().min(1).max(100).optional().nullable(),
  resumePackCredits: z.number().int().min(0).max(100).optional(), // WBS 10.7
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const roleChanging =
      parsed.data.role !== undefined && parsed.data.role !== user.role;
    const actor = roleChanging ? await requireSuperAdmin() : await requireAdmin();
    if (!actor) {
      return NextResponse.json(
        {
          error: roleChanging
            ? "Forbidden — changing user role requires super admin"
            : "Forbidden",
        },
        { status: 403 }
      );
    }

    const data: Record<string, unknown> = { ...parsed.data };
    const sub = parsed.data.subscription === "free" ? "basic" : parsed.data.subscription;
    if (parsed.data.subscription !== undefined) {
      data.subscription = sub;
    }
    if (sub === "pro_trial_14") {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);
      data.subscriptionExpiresAt = expiresAt;
    } else if (sub) {
      data.subscriptionExpiresAt = null;
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    await logAdminAction({
      action: "admin_user_update",
      adminUserId: actor.id,
      targetUserId: id,
      meta: { fields: Object.keys(parsed.data) },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin update user error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
