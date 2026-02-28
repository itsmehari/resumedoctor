// WBS 10.3 – Create Stripe Checkout session for subscription
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  plan: z.enum(["pro_monthly", "pro_annual"]),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

function getPriceId(plan: "pro_monthly" | "pro_annual"): string | null {
  if (plan === "pro_monthly")
    return process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? null;
  return process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? null;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Payments not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const priceId = getPriceId(parsed.data.plan);
    if (!priceId) {
      return NextResponse.json(
        { error: `Price not configured for ${parsed.data.plan}` },
        { status: 503 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl =
      parsed.data.successUrl || `${baseUrl}/dashboard?upgraded=1`;
    const cancelUrl = parsed.data.cancelUrl || `${baseUrl}/pricing`;

    let userId = (session.user as { id?: string }).id;
    if (!userId && session.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id ?? undefined;
    }
    if (!userId) {
      return NextResponse.json(
        { error: "Session invalid" },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: session.user.email,
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
