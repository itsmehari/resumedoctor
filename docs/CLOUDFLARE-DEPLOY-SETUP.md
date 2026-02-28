# Cloudflare Deploy Setup for ResumeDoctor

This guide covers deploying resumedoctor.in to Cloudflare. Your app is **full-stack** (API routes, NextAuth, Prisma, database), so use **Cloudflare Workers** (not static Pages).

---

## Option A: Cloudflare Workers (Recommended)

Cloudflare recommends Workers for full Next.js apps. Uses the OpenNext adapter.

### 1. Project setup (already added)

These files were added to your project:

- `open-next.config.ts` – OpenNext config
- `wrangler.jsonc` – Wrangler/Workers config  
- `package.json` – `preview` and `deploy` scripts

### 2. Install dependencies

```bash
npm install @opennextjs/cloudflare wrangler --save-dev --legacy-peer-deps
```

> **Note:** Next.js 14 may need `--legacy-peer-deps` for OpenNext.

### 3. Connect GitHub to Cloudflare Workers

1. **Workers & Pages** → **Create** → **Workers** (not Pages)
2. **Connect to Git** → choose GitHub → select `resumedoctor`
3. Configure build (use **both** commands – Workers Builds runs them separately):
   - **Build command:** `npm run build:cloudflare`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/` (leave default)
4. **Environment variables** – add all from `.env.example`:

| Variable | Example / Notes |
|----------|-----------------|
| `DATABASE_URL` | Neon Postgres connection string |
| `NEXTAUTH_URL` | `https://resumedoctor.in` |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `RESEND_API_KEY` | From Resend dashboard |
| `NEXT_PUBLIC_APP_URL` | `https://resumedoctor.in` |
| `OPENAI_API_KEY` | If using AI features |
| (Optional) OAuth, S3, etc. | See `.env.example` |

5. Deploy – Cloudflare runs the build command (OpenNext), then the deploy command (Wrangler), and hosts the app.

> **Important:** The build step must use `build:cloudflare` (OpenNext), not `next build`. OpenNext produces the `.open-next` output that Wrangler deploys.

### 4. Fix build in Cloudflare dashboard (required)

Workers Builds does **not** read build commands from wrangler. You must set them manually:

1. Go to **Workers & Pages** → **resumedoctor** → **Settings** → **Build**
2. Set **Build command** to: `npm run build:cloudflare`
3. Set **Deploy command** to: `npx wrangler deploy`
4. Save

Without this, the deploy will fail with "Could not find compiled Open Next config".

### 5. Custom domain

1. Worker project → **Settings** → **Domains & Routes**
2. Add custom domain: `resumedoctor.in` and `www.resumedoctor.in`
3. Cloudflare will create the needed DNS records (you already use Cloudflare for DNS).

---

## Option B: Cloudflare Pages (Next.js preset)

For a quick try, you can use Pages with the Next.js preset. Some server features may have limits.

On the **Configure build** screen:

| Field | Value |
|-------|-------|
| **Framework preset** | `Next.js` |
| **Build command** | `npx @cloudflare/next-on-pages@1` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | `/` |

**Environment variables** – expand “Environment variables (advanced)” and add the same variables as in Option A.

> **Note:** `@cloudflare/next-on-pages` uses the Edge runtime. Prisma with Neon HTTP usually works; some Node modules (e.g. bcrypt) may need changes.

---

## Option C: Vercel (easiest for Next.js)

1. Push code to GitHub
2. [vercel.com](https://vercel.com) → **Add New Project** → import `resumedoctor`
3. Add env vars
4. Deploy
5. In Cloudflare DNS, add CNAME `@` → `cname.vercel-dns.com` for `resumedoctor.in`

Domain stays on Cloudflare; hosting is on Vercel.

---

## Checklist before deploy

- [ ] Code pushed to GitHub
- [ ] Neon (or other) Postgres DB created
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Env vars set in Cloudflare (or Vercel)
- [ ] Resend API key for emails
- [ ] OAuth redirect URIs updated for prod (if using Google/LinkedIn)

---

## Troubleshooting

### Build fails with peer dependency error

Use `--legacy-peer-deps`:

```bash
npm install --legacy-peer-deps
```

### Windows build issues

OpenNext recommends deploying from Linux. Use:

- **Cloudflare Workers Builds** (runs on Cloudflare’s Linux), or  
- **GitHub Actions** with a Linux runner.

### Worker size limit

Workers Free: 3 MiB compressed. If you hit it, consider the Workers Paid plan or Vercel.
