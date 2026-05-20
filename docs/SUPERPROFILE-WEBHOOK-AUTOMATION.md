# SuperProfile → ResumeDoctor webhook automation

ResumeDoctor fulfils Pro and packs when **SuperProfile** sends a JSON payload to:

`POST https://www.resumedoctor.in/api/webhooks/superprofile`

## Required environment (Vercel)

| Variable | Purpose |
|----------|---------|
| `SUPERPROFILE_WEBHOOK_SECRET` | Shared secret; sent as `Authorization: Bearer <secret>` or `x-superprofile-secret` |
| `NEXT_PUBLIC_SUPERPROFILE_URL_*` | Checkout links on `/pricing` |
| `NEXT_PUBLIC_APP_URL` | `https://www.resumedoctor.in` |

## If SuperProfile has no “webhook URL” field

SuperProfile may not expose a native outbound webhook in your plan. Options:

1. **Zapier / Make / Pabbly** — Trigger on “new purchase” → HTTP POST to the URL above with the same JSON shape the app expects (see `src/lib/superprofile-webhook-normalize.ts`).
2. **Manual replay** — For testing, POST sample JSON from the SuperProfile dashboard export using curl (staging only).
3. **Email parsing** — Not recommended; use automation tools instead.

## Payload expectations

- Must include purchaser **email** (same as ResumeDoctor account).
- Include **productKey** or plan identifier mapped in `src/lib/superprofile-fulfillment.ts`.
- Idempotency: duplicate posts with the same key must not double-grant (handled via `SuperprofilePurchaseEvent.idempotencyKey`).

## Verify after go-live

1. Complete a test purchase with the same email as a test user.
2. Check `/admin/purchases` for a new row.
3. Confirm user `subscription` or `resumePackCredits` updated on `/admin/users/[id]`.

## Ops checklist

- [ ] `SUPERPROFILE_WEBHOOK_SECRET` set in Vercel production
- [ ] Automation tool POST includes auth header
- [ ] Test purchase reconciled in admin purchases ledger
