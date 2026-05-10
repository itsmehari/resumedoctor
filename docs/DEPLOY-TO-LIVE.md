# Deploy ResumeDoctor to Production

**Current hosting:** Vercel (Hobby)

---

## Deploy to Vercel

### Option A: Git push (automatic)

1. Push to `main` (or your production branch)
2. Vercel builds and deploys automatically
3. Production URL: `https://resumedoctor.in`

### Option B: Vercel CLI

```bash
# Install CLI (if not already)
npm i -g vercel

# Deploy to production
npm run deploy
# or
vercel --prod
```

---

## Environment variables

Set in **Vercel Dashboard** → Project → Settings → Environment Variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | ✅ | Neon/Supabase Postgres (pooled for serverless) |
| `DIRECT_URL` | ✅ | Same DB, direct (non-pooled) connection for Prisma |
| `NEXTAUTH_URL` | ✅ | `https://resumedoctor.in` |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://resumedoctor.in` |
| `BREVO_API_KEY` | ✅ | Email via Brevo (verify, reset, **trial OTP**); also `EMAIL_FROM` |
| `OPENAI_API_KEY` | ⚠️ | If using AI features |
| `TRIAL_SESSION_SECRET` | optional | Trial JWT (falls back to NEXTAUTH_SECRET) |
| OAuth keys | optional | Google, LinkedIn |

**Neon:** Use the **Transaction** pooler URL for `DATABASE_URL`, and the **Direct** connection URL for `DIRECT_URL`.

---

## Troubleshooting: Trial "Service temporarily unavailable"

**Step 1: Run the health check**

Visit: **https://resumedoctor.in/api/health**

This shows which env vars or services are missing. Fix any failing checks.

**Step 2: Common fixes**

| Check fails | Fix |
|-------------|-----|
| BREVO_API_KEY | Add in Vercel → Env Vars. Key from [Brevo](https://app.brevo.com/settings/keys/api) (Transactional emails). Set `EMAIL_FROM` to a verified sender. |
| DATABASE_URL | Add your Neon/Supabase **pooled** connection string. |
| DIRECT_URL | Add your Neon/Supabase **direct** (non-pooled) connection string. Prisma needs both. |
| Migrations / TrialSession | Run `npx prisma migrate deploy` against production DB (use DIRECT_URL). |

**Step 3: Redeploy**

After adding env vars, redeploy: Vercel → Deployments → Redeploy.

---

## After deploy

- Run `npx prisma migrate deploy` if DB schema changed
- Verify: sign up, login, create resume, export PDF
- Check Vercel → Deployments for build logs

---

## Rollback

Vercel Dashboard → Deployments → select previous deploy → **Promote to Production**
