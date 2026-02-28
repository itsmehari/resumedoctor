# Stripe Setup (WBS 10)

Configure Stripe for subscription payments.

## 1. Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Add product **Pro Monthly**:
   - Name: Pro Monthly
   - Pricing: Recurring, ₹199/month (or your price)
   - Copy the **Price ID** (starts with `price_`)
3. Add product **Pro Annual**:
   - Name: Pro Annual
   - Pricing: Recurring, ₹1,499/year
   - Copy the **Price ID**

## 2. Environment Variables

Add to `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...          # From Stripe Dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
```

## 3. Webhook (Production)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 4. Local Testing

Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the printed webhook signing secret as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## 5. Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`
