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

## Payment Pages app (`/app/payment_pages`)

Signed-in URL: [superprofile.bio/app/payment_pages](https://superprofile.bio/app/payment_pages). Without a session, that path shows the public site — open it **after** you log into SuperProfile.

Walk through it in this order:

1. **List** — You should see each **payment page / product** you created (e.g. Pro monthly, annual, 14‑day pass, resume pack). If something ResumeDoctor advertises is missing, create the page here first.

2. **Buyer link per product** — Open a page → use **Share**, **View live**, or **Copy link** so you get the **customer** checkout URL (shape like `https://superprofile.bio/vp/<id>`). Put each URL into the matching **`NEXT_PUBLIC_SUPERPROFILE_URL_*`** in Vercel (see **`docs/DEPLOYMENT-REQUIREMENTS.md`** table: trial → `pro_trial_14`, monthly → `pro_monthly`, etc.). Do **not** paste `/create-payment-page/...` editor URLs as the public checkout link.

3. **Fulfillment is not automatic** — Completing payment on SuperProfile **does not** by itself call ResumeDoctor. You need an automation that sends **`POST`** to **`https://www.resumedoctor.in/api/webhooks/superprofile`** with the shared secret and JSON (`idempotencyKey`, `email`, `productKey`). Typical setup: **Zapier** — trigger *“New sale”* (or equivalent) on SuperProfile → action **Webhooks by Zapier** *Custom Request* (POST, JSON). **Make**, **Pabbly Connect**, etc. work the same idea.

4. **Map fields** — Use the buyer’s **email** from the sale as `email` (must match an existing ResumeDoctor user). Use a **unique payment / order id** from SuperProfile as `idempotencyKey` (if it is shorter than 8 characters, the app prefixes it). Set **`productKey`** to exactly one of: `pro_monthly`, `pro_annual`, `pro_trial_14`, `resume_pack` — usually **one workflow per product** so `productKey` is fixed, or use a filter/router on product name/id.

5. **Test** — After a test purchase, check Vercel logs for `[superprofile_webhook]` and Admin → Purchases → SuperProfile.

## Price on SuperProfile

Set the product price on SuperProfile (e.g. **₹49** for the 14-day trial) to match what you advertise on [resumedoctor.in/pricing](https://resumedoctor.in/pricing). ResumeDoctor only links to your page; it does not set SuperProfile’s price.
