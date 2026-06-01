# SuperProfile checkout links (ResumeDoctor)

## Use the **buyer** URL, not the **editor** URL

Environment variables `NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14`, `NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY`, `NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL`, and `NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK` must be the **public payment page** where a customer completes payment.

**Wrong (example):**

- `https://superprofile.bio/create-payment-page/...` — this is the **creator dashboard** flow to create or edit a payment page. Visitors who are not logged in as you may see a setup experience instead of a clean checkout.

**Right:**

- From your SuperProfile dashboard, open the **published** product / payment page and use **Share**, **Copy link**, **View live page**, or the customer-facing URL SuperProfile gives for that product. It is usually **not** under `/create-payment-page/`.

After updating the URL in Vercel (Project → Settings → Environment Variables), redeploy.

## Post-purchase redirect + Google Ads conversion (₹49 trial)

After payment on the **14-day full Pro** product, SuperProfile redirects the buyer to:

`https://www.resumedoctor.in/payment/success`

**Setup in SuperProfile:** open your ₹49 payment page → set the **success / redirect URL** after payment to the URL above. No Zapier or webhook is required for this step.

**Setup in Google Ads:** create a conversion action → **Website** → thank-you page URL:

`https://www.resumedoctor.in/payment/success`

Copy the conversion tag label into Vercel as `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO` (default in code: `AW-18199694938/94gZCLbZ2rYcENqcpeZD`). The page fires `gtag('event', 'conversion', { send_to: '...' })` when someone lands here after checkout.

The old path `/pricing/thank-you` redirects here automatically.

## Webhook URL (optional — Pro entitlement in app)

If you later want purchases to **automatically unlock Pro** inside ResumeDoctor (not just track conversions), use **`POST /api/webhooks/superprofile`** — see **`docs/DEPLOYMENT-REQUIREMENTS.md`**. This is optional and separate from the redirect + Google Ads flow above.
