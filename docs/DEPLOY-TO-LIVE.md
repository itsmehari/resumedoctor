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
| `DATABASE_URL` | ✅ | Neon/Supabase Postgres |
| `NEXTAUTH_URL` | ✅ | `https://resumedoctor.in` |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://resumedoctor.in` |
| `RESEND_API_KEY` | ✅ | Email (verify, reset) |
| `OPENAI_API_KEY` | ⚠️ | If using AI features |
| `TRIAL_SESSION_SECRET` | optional | Trial JWT (falls back to NEXTAUTH_SECRET) |
| OAuth keys | optional | Google, LinkedIn |

---

## After deploy

- Run `npx prisma migrate deploy` if DB schema changed
- Verify: sign up, login, create resume, export PDF
- Check Vercel → Deployments for build logs

---

## Rollback

Vercel Dashboard → Deployments → select previous deploy → **Promote to Production**
