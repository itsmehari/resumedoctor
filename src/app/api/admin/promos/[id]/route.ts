// Admin – PromoCode update / delete
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";

const patchSchema = z.object({
  discountType: z.enum(["percent", "fixed"]).optional(),
  discountValue: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.promoCode.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data: {
    discountType?: string;
    discountValue?: number;
    expiresAt?: Date | null;
    usageLimit?: number | null;
  } = {};
  if (parsed.data.discountType !== undefined) data.discountType = parsed.data.discountType;
  if (parsed.data.discountValue !== undefined) data.discountValue = parsed.data.discountValue;
  if (parsed.data.expiresAt !== undefined) {
    data.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
  }
  if (parsed.data.usageLimit !== undefined) data.usageLimit = parsed.data.usageLimit;

  const promo = await prisma.promoCode.update({
    where: { id },
    data,
  });

  await logAdminAction({
    action: "admin_promo_update",
    adminUserId: admin.id,
    meta: { promoId: id, code: promo.code },
  });

  return NextResponse.json(promo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.promoCode.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.promoCode.delete({ where: { id } });

  await logAdminAction({
    action: "admin_promo_delete",
    adminUserId: admin.id,
    meta: { promoId: id, code: existing.code },
  });

  return NextResponse.json({ success: true });
}
