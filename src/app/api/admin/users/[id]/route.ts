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
  subscription: z.enum(["free", "trial", "pro_monthly", "pro_annual"]).optional(),
  name: z.string().min(1).max(100).optional().nullable(),
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

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data as Record<string, unknown>,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin update user error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
