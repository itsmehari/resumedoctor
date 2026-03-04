// Admin – User detail, update
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

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
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

const updateSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  subscription: z.enum(["free", "trial", "pro_monthly", "pro_annual", "pro_trial_14"]).optional(),
  name: z.string().min(1).max(100).optional().nullable(),
  resumePackCredits: z.number().int().min(0).max(100).optional(), // WBS 10.7
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

    const data: Record<string, unknown> = { ...parsed.data };
    const sub = parsed.data.subscription;
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

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin update user error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
