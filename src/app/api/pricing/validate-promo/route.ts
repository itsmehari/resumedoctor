// Validate promo code
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().min(1).max(50),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ valid: false, error: "Invalid code" }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: parsed.data.code.trim().toUpperCase() },
    });

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Invalid or expired code" });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Code has expired" });
    }

    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ valid: false, error: "Code has reached usage limit" });
    }

    const label =
      promo.discountType === "percent"
        ? `${promo.discountValue}% off`
        : `₹${promo.discountValue / 100} off`;

    return NextResponse.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      label,
    });
  } catch (err) {
    console.error("Validate promo error:", err);
    return NextResponse.json({ valid: false, error: "Something went wrong" }, { status: 500 });
  }
}
