# ResumeDoctor – Billing (SuperProfile)

## Customer payments: SuperProfile only

All **customer-facing** purchases (Pro monthly/annual, ₹1 fourteen-day trial, resume pack) are taken through **SuperProfile** checkout links on `/pricing` (`NEXT_PUBLIC_SUPERPROFILE_URL_*`).

- **Webhook:** `POST /api/webhooks/superprofile` – validates the shared secret, idempotency, and calls `fulfillSuperprofilePurchase` in `src/lib/superprofile-fulfillment.ts` to set `User.subscription`, `subscriptionExpiresAt` (for `pro_trial_14`), `billingProvider: "superprofile"`, and resume pack credits.
- **Email match:** Users must use the **same email** on SuperProfile and ResumeDoctor so fulfillment can attach the purchase to the correct account.

## Self-serve UPI / trial form (closed)

- `POST /api/pricing/trial-activation` returns **410** – manual UPI + “submit ref” is no longer a customer path; SuperProfile is used instead.
- The `/pricing/verify-trial` page points users to SuperProfile.
- **Admin** can still approve **legacy** rows in `/admin` trial activations if needed.

## Stripe (legacy, disabled in product)

- **`POST /api/billing/checkout`** returns **501** – card checkout is not offered; keep route so old clients get a clear message.
- **`POST /api/billing/webhook`** may remain for any historical Stripe events; it is not part of the default purchase flow.
- `STRIPE_*` env vars are optional if Stripe is fully unused.

## Crons

- `GET /api/cron/trial-expired-downgrade` (with `CRON_SECRET`) – users past `pro_trial_14` end date are moved to `free` for a clean database state.
- `GET /api/cron/trial-expiry-reminders` – reminder emails before trial end (if email is configured).

## `User.billingProvider`

`stripe` | `superprofile` | `manual` (admin grants) / unset – for reporting and support.
