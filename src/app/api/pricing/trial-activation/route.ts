// WBS 10.6 – Submit 14-day trial activation request (user paid ₹1 via UPI)
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email("Valid email required"),
  upiRef: z.string().min(6, "UPI reference required").max(50),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.email?.[0] ?? parsed.error.flatten().fieldErrors.upiRef?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const existing = await prisma.trialActivationRequest.findFirst({
      where: { email: parsed.data.email, status: "pending" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending request. We'll activate within 24 hours." },
        { status: 400 }
      );
    }

    await prisma.trialActivationRequest.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        upiRef: parsed.data.upiRef.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Request submitted. We'll activate your 14-day Pro trial within 24 hours. Check your email.",
    });
  } catch (err) {
    console.error("Trial activation request error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
