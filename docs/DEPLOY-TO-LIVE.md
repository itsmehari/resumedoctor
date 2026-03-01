# Deploy ResumeDoctor to Production

Your build is failing on Cloudflare because the Worker exceeds the **3 MiB limit** (free plan).

## Fastest fix: Deploy to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Import `itsmehari/resumedoctor` from GitHub
3. Add environment variables (from `.env.example`)
4. Click **Deploy**

Vercel has no Worker size limit and works with Next.js out of the box.

---

## If you want to stay on Cloudflare

### Option A: Try minify (may work)

In **Cloudflare Dashboard** → Workers & Pages → resumedoctor → **Settings** → **Build**:

- Change **Deploy command** to: `npx wrangler deploy --minify`
- Save and **Retry deployment**

### Option B: Upgrade to Workers Paid ($5/mo)

- 10 MiB limit instead of 3 MiB
- [Upgrade](https://dash.cloudflare.com)

---

## After deploy

- Set `NEXT_PUBLIC_APP_URL` to your live URL (e.g. `https://resumedoctor.in`)
- Ensure `NEXTAUTH_URL` matches
- Run `npx prisma migrate deploy` if DB schema changed
