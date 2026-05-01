// Admin – PromoCode list & create
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";

const createSchema = z.object({
  code: z.string().min(1).max(64),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.number().int().positive(),
  expiresAt: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ promos });
}

export async function POST(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const code = parsed.data.code.trim().toUpperCase();
  const expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;

  try {
    const promo = await prisma.promoCode.create({
      data: {
        code,
        discountType: parsed.data.discountType,
        discountValue: parsed.data.discountValue,
        expiresAt,
        usageLimit: parsed.data.usageLimit ?? null,
      },
    });

    await logAdminAction({
      action: "admin_promo_create",
      adminUserId: admin.id,
      meta: { promoId: promo.id, code },
    });

    return NextResponse.json(promo);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }
    console.error("admin promo create", e);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
