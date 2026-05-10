# Migration: Cloudflare Workers → Vercel

> **Status: Completed.** Domain is on Vercel. Cloudflare deps and config removed from codebase.

Step-by-step guide to move resumedoctor.in from Cloudflare Workers to Vercel.

---

## Why migrate?

- No bundle size limit (250 MB vs 10 MB on Cloudflare)
- Native Next.js support (no OpenNext adapter)
- Free Hobby tier for non-commercial use
- Better fit for a growing app with more features and templates

---

## Pre-migration checklist

Before you start:

- [ ] Database is external (Neon, Supabase, etc.) – **no change needed**
- [ ] You have access to Cloudflare dashboard (DNS)
- [ ] You have or can create a Vercel account
- [ ] GitHub repo `resumedoctor` is up to date
- [ ] Note down all env vars from Cloudflare (or export them)

---

## Phase 1: Set up Vercel (before DNS switch)

### Step 1.1 – Create Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub).
2. **Add New** → **Project**
3. Import `resumedoctor` (or `itsmehari/resumedoctor`) from GitHub
4. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` or leave default
   - Output Directory: leave default
   - Install Command: `npm install`

### Step 1.2 – Add environment variables

In **Project → Settings → Environment Variables**, add these (copy from Cloudflare or `.env.example`):

| Variable | Required | Notes |
|----------|----------|------|
| `DATABASE_URL` | ✅ | Neon/Supabase Postgres URL |
| `NEXTAUTH_URL` | ✅ | `https://resumedoctor.in` (production) |
| `NEXTAUTH_SECRET` | ✅ | Same as Cloudflare |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://resumedoctor.in` |
| `ZEPTOMAIL_SEND_TOKEN` | ✅ | ZeptoMail Agent → Send Mail Token; plus `EMAIL_FROM` |
| `OPENAI_API_KEY` | ⚠️ | If you use AI features |
| `TRIAL_SESSION_SECRET` | optional | Trial JWT secret |
| `GOOGLE_CLIENT_ID` | optional | For OAuth |
| `GOOGLE_CLIENT_SECRET` | optional | |
| `LINKEDIN_CLIENT_ID` | optional | |
| `LINKEDIN_CLIENT_SECRET` | optional | |
| `EMAIL_FROM` | optional | e.g. `ResumeDoctor <noreply@resumedoctor.in>` |

For `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`:
- Use `https://resumedoctor.in` for **Production**
- Use the Vercel preview URL (e.g. `https://resumedoctor-xxx.vercel.app`) for **Preview** if you want preview deploys to work with auth

### Step 1.3 – First deploy

1. Click **Deploy**
2. Wait for the build. It uses `npm run build` (standard Next.js) – no OpenNext.
3. After deploy, visit `https://resumedoctor-xxx.vercel.app` (or your project’s URL)
4. Verify: homepage loads, login/signup works, resume creation works

### Step 1.4 – Add custom domain (don’t switch DNS yet)

1. **Project → Settings → Domains**
2. Add `resumedoctor.in`
3. Add `www.resumedoctor.in`
4. Vercel will show DNS instructions. **Don’t change DNS yet** – you’ll do that in Phase 2

---

## Phase 2: Switch DNS to Vercel

### Step 2.1 – OAuth callback URLs (if using Google/LinkedIn)

If you use OAuth:

1. **Google Cloud Console** → APIs & Services → Credentials → your OAuth client
   - Authorized redirect URIs: `https://resumedoctor.in/api/auth/callback/google` (already correct if you use the domain)
2. **LinkedIn Developer** → your app → Auth → Redirect URLs
   - Add: `https://resumedoctor.in/api/auth/callback/linkedin`

No change needed if `resumedoctor.in` is already listed – it will resolve to Vercel after DNS switch.

### Step 2.2 – Update DNS in Cloudflare

1. Go to **Cloudflare Dashboard** → **Websites** → **resumedoctor.in** → **DNS**
2. Find the record for `@` (root) or `www` that points to Cloudflare Workers
3. **Option A – Vercel nameservers (simplest):**
   - In Vercel: Domains → resumedoctor.in → “Use Vercel DNS”
   - In Cloudflare: Change nameservers to Vercel’s (Vercel will show them)
   - This moves full DNS to Vercel
4. **Option B – Keep Cloudflare DNS (recommended if you use CF for other reasons):**
   - Edit the `@` (root) record: Type **CNAME**, Name `@`, Target `cname.vercel-dns.com` (or the value Vercel shows)
   - Edit the `www` record: Type **CNAME**, Name `www`, Target `cname.vercel-dns.com`
   - If Cloudflare requires A records for root: Vercel provides IPs; use those for `@`

### Step 2.3 – Propagation and verification

1. DNS can take 5–60 minutes to propagate
2. Check: `nslookup resumedoctor.in` or [dnschecker.org](https://dnschecker.org)
3. Visit `https://resumedoctor.in` – it should hit Vercel
4. Test: login, create resume, export PDF/DOCX

---

## Phase 3: Disconnect Cloudflare Workers

Once Vercel is serving traffic:

1. **Cloudflare Dashboard** → **Workers & Pages**
2. Find the `resumedoctor` Worker project
3. **Settings** → **Delete project** (or disable auto-deploy from GitHub)
4. This stops builds and avoids confusion. DNS can stay on Cloudflare if you chose Option B above.

---

## Phase 4: Optional cleanup (after confirming Vercel works)

After a few days on Vercel with no issues:

1. **Add Vercel deploy script** (optional):
   ```json
   "deploy:vercel": "vercel --prod"
   ```
   (Or rely on Git push → auto-deploy.)

2. **Optional – remove Cloudflare dev deps** (only if you’re sure you won’t roll back):
   ```bash
   npm uninstall @opennextjs/cloudflare wrangler
   ```
   And remove from package.json scripts:
   - `build:cloudflare`
   - `preview` (if it uses opennextjs-cloudflare)
   - Update `deploy` to use Vercel or remove it

3. **Keep** `vercel.json` – it’s already set for Next.js:
   ```json
   {"framework":"nextjs","buildCommand":"npm run build"}
   ```

---

## Rollback plan (if something goes wrong)

1. **Revert DNS** in Cloudflare:
   - Change `@` and `www` back to Cloudflare Workers (or previous targets)
2. Wait for DNS propagation
3. Cloudflare Workers will serve the app again if the project is still connected
4. If you deleted the Cloudflare project: redeploy from GitHub after reconnecting the repo

---

## Summary

| Step | Action |
|------|--------|
| 1 | Create Vercel project, add env vars, deploy |
| 2 | Test on `*.vercel.app` URL |
| 3 | Add `resumedoctor.in` and `www.resumedoctor.in` in Vercel |
| 4 | Update Cloudflare DNS to point to Vercel |
| 5 | Verify production, then disable/delete Cloudflare Worker |
| 6 | (Optional) Remove Cloudflare-related scripts and deps |

---

## FAQ

**Will my database/data be affected?**  
No. Database (Neon/Supabase) is external. Only the hosting platform changes.

**Do I need to change NextAuth URLs?**  
`NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` stay `https://resumedoctor.in`. After DNS points to Vercel, callbacks will hit Vercel.

**What about the trial flow?**  
Works as-is. Ensure `TRIAL_SESSION_SECRET` (or `NEXTAUTH_SECRET` fallback) is set in Vercel.

**Can I keep Cloudflare for DNS only?**  
Yes. Use Option B in Step 2.2. Domain stays on Cloudflare; only the A/CNAME target changes to Vercel.
