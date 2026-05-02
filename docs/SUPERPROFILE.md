# SuperProfile checkout links (ResumeDoctor)

## Use the **buyer** URL, not the **editor** URL

Environment variables `NEXT_PUBLIC_SUPERPROFILE_URL_TRIAL_14`, `NEXT_PUBLIC_SUPERPROFILE_URL_PRO_MONTHLY`, `NEXT_PUBLIC_SUPERPROFILE_URL_PRO_ANNUAL`, and `NEXT_PUBLIC_SUPERPROFILE_URL_RESUME_PACK` must be the **public payment page** where a customer completes payment.

**Wrong (example):**

- `https://superprofile.bio/create-payment-page/...` — this is the **creator dashboard** flow to create or edit a payment page. Visitors who are not logged in as you may see a setup experience instead of a clean checkout.

**Right:**

- From your SuperProfile dashboard, open the **published** product / payment page and use **Share**, **Copy link**, **View live page**, or the customer-facing URL SuperProfile gives for that product. It is usually **not** under `/create-payment-page/`.

After updating the URL in Vercel (Project → Settings → Environment Variables), redeploy.

## Webhook URL (Zapier / Make / SuperProfile automation)

Fulfillment is **`POST /api/webhooks/superprofile`** on production. Use the **`www`** hostname:

`https://www.resumedoctor.in/api/webhooks/superprofile`

The apex domain redirects (`resumedoctor.in` → `www`) with **308**; some tools never complete a POST after that redirect, so purchases never reach the app. Match **`SUPERPROFILE_WEBHOOK_SECRET`** in Vercel with `Authorization: Bearer …` or `X-Superprofile-Webhook-Secret`. JSON body contract and `productKey` values are documented in **`docs/DEPLOYMENT-REQUIREMENTS.md`** (SuperProfile section).

## Price on SuperProfile

Set the product price on SuperProfile (e.g. **₹49** for the 14-day trial) to match what you advertise on [resumedoctor.in/pricing](https://resumedoctor.in/pricing). ResumeDoctor only links to your page; it does not set SuperProfile’s price.
