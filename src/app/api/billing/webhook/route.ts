// Stripe webhook – idempotent subscription + invoice updates
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, parseCheckoutPlanId } from "@/lib/billing/stripe";
import { recordProductEvent } from "@/lib/product-events";
import { AnalyticsEvents } from "@/lib/analytics-event-names";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId ?? session.client_reference_id ?? undefined;
    const planId = parseCheckoutPlanId(session.metadata?.planId ?? "");

    if (!userId || !planId) {
      console.error("[stripe webhook] missing metadata", session.id);
      return NextResponse.json({ received: true });
    }

    const existing = await prisma.invoice.findFirst({
      where: { externalRef: session.id },
    });
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const amountTotal = session.amount_total ?? 0;
    const currency = (session.currency ?? "inr").toUpperCase();

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null;

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const expiresAt =
      planId === "pro_trial_14"
        ? (() => {
            const d = new Date();
            d.setDate(d.getDate() + 14);
            return d;
          })()
        : null;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          subscription: planId,
          subscriptionExpiresAt: expiresAt,
          billingProvider: "stripe",
          ...(customerId ? { stripeCustomerId: customerId } : {}),
          ...(paymentIntentId ? { subscriptionId: paymentIntentId } : {}),
        },
      });

      await tx.invoice.create({
        data: {
          userId,
          amount: amountTotal,
          currency,
          plan: planId,
          status: "paid",
          externalRef: session.id,
        },
      });
    });

    await recordProductEvent({
      userId,
      name: AnalyticsEvents.payment_success,
      props: { plan_id: planId, currency, session_id: session.id },
    });
  }

  return NextResponse.json({ received: true });
}
