# Cloudflare Worker Size Audit

> **Archived.** Migration to Vercel completed. Kept for reference.

**Measured:** `wrangler deploy --dry-run` (after `npm run build:cloudflare`)

## Limits (compressed / gzip)

| Plan | Limit | Your bundle |
|------|-------|-------------|
| **Free** | 3 MB | ❌ 6 MB — about 2× over |
| **Paid ($5/mo)** | 10 MB | ✅ 6 MB — fits with ~4 MB headroom |

---

## Measured sizes

| Metric | Size |
|--------|------|
| **Total upload (uncompressed)** | 14,045 KiB (~13.7 MB) |
| **gzip (compressed)** | **6,117 KiB (~5.97 MB)** |

Cloudflare enforces the **gzip** size (6 MB).

---

## How to re-check size

```bash
npm run build:cloudflare
npx wrangler deploy --dry-run --outdir bundled/
```

Look for `gzip: X.XX KiB` in the output.

---

## Largest dependencies (in bundle)

| Package | Purpose | Size impact |
|---------|---------|-------------|
| `docx` | Word export | High |
| `jspdf` + `html2canvas` | PDF export (client) | High |
| Prisma Client | Database | High |
| NextAuth | Auth | Medium |
| `react-markdown` | Blog | Medium |
| `gray-matter` | Blog frontmatter | Low |
| `@dnd-kit/*` | Drag-and-drop | Medium |
| Radix UI | Components | Medium |
| OpenAI | AI (if used) | Medium |

---

## If you upgrade to Paid ($5/mo)

1. **You will fit** — 6 MB < 10 MB limit (verified).
2. Keep `--minify` in the deploy command.
3. Deploy: `npm run deploy` or configure Cloudflare dashboard to use it.

---

## If it still exceeds 10 MB

Options to shrink the bundle:

1. **Move PDF/DOCX export to an API** – e.g. use a separate service or edge function.
2. **Lazy-load heavy routes** – Dynamic imports for resume editor.
3. **Remove or replace heavy deps** – e.g. lighter alternatives to `docx` or `jspdf`.
4. **Deploy on Vercel** – No Worker size limit; Next.js is supported natively.

---

## Recommendation

**Upgrade to Workers Paid ($5/mo).** Your gzipped bundle (6 MB) fits within the 10 MB limit with room to spare.

