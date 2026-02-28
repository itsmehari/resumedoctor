// WBS 10.4 – Stripe webhook (success, cancel, refund)
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Stripe webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const userId =
          session.client_reference_id ??
          (session.metadata?.userId as string | undefined);
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        if (!userId) {
          console.error("Webhook: no userId in checkout.session.completed");
          break;
        }

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id;
        const interval = sub.items.data[0]?.price.recurring?.interval;

        const plan =
          interval === "year"
            ? "pro_annual"
            : interval === "month"
              ? "pro_monthly"
              : "pro_monthly";

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscription: plan,
            subscriptionId,
          },
        });
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        if (event.type === "customer.subscription.deleted") {
          const user = await prisma.user.findFirst({
            where: { subscriptionId: sub.id },
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { subscription: "free", subscriptionId: null },
            });
          }
        } else if (sub.status === "active") {
          const userId = sub.metadata?.userId as string | undefined;
          if (userId) {
            const interval = sub.items.data[0]?.price.recurring?.interval;
            const plan =
              interval === "year" ? "pro_annual" : "pro_monthly";
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscription: plan,
                subscriptionId: sub.id,
              },
            });
          }
        }
        break;
      }

      default:
        // Unhandled event – ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
