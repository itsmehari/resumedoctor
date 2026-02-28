# ResumeDoctor – Local Development Setup & Dependencies (resumedoctor.in)

**Last Updated:** 2026-02-27

---

## 1. Prerequisites (System Requirements)

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20.x LTS | Recommended: 20.10+ |
| pnpm | 9.x | Or npm 10+ / yarn 4+ |
| PostgreSQL | 15+ | Hosted (recommended), local, or Docker |
| Redis | 7.x | Optional for MVP; required for AI caching |
| Git | 2.40+ | — |

### Install Prerequisites

**Windows (PowerShell):**
```powershell
# Node via nvm-windows or direct install
# https://nodejs.org/

# pnpm
npm install -g pnpm

# Docker Desktop (for PostgreSQL + Redis)
# https://www.docker.com/products/docker-desktop/
```

**macOS / Linux:**
```bash
# Node via nvm
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm

# PostgreSQL (macOS)
brew install postgresql@15 redis

# Or via Docker
docker run -d --name resumedoctor-db -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:15
docker run -d --name resumedoctor-redis -p 6379:6379 redis:7-alpine
```

---

## 2. Project Dependencies

### 2.1 Frontend Dependencies (`package.json`)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "lucide-react": "^0.344.0",
    "tailwindcss": "^3.4.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "date-fns": "^3.3.1",
    "zod": "^3.22.4",
    "@tanstack/react-query": "^5.28.0",
    "next-auth": "^4.24.5",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

### 2.2 Backend / API Dependencies

*(If using Next.js API routes, these go in the same `package.json`.)*

```json
{
  "dependencies": {
    "@prisma/client": "^5.9.0",
    "openai": "^4.28.0",
    "ioredis": "^5.3.2",
    "pdf-parse": "^1.1.1",
    "docxtemplater": "^3.42.0",
    "pizzip": "^3.1.6"
  },
  "devDependencies": {
    "prisma": "^5.9.0"
  }
}
```

### 2.3 Optional (Phase 2+)

| Package | Purpose |
|---------|---------|
| `@aws-sdk/client-s3` | S3/R2 file storage |
| `puppeteer` | High-fidelity PDF export |
| `@anthropic-ai/sdk` | Claude API (alternative to OpenAI) |

---

## 3. Environment Variables

Create `.env.local` from `.env.example`:

```bash
# .env.example
# ===========================================
# ResumeDoctor – Local Development Environment
# ===========================================

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:dev@localhost:5432/resumedoctor_dev"

# Auth (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# OAuth (optional for local)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# LINKEDIN_CLIENT_ID=
# LINKEDIN_CLIENT_SECRET=

# AI (OpenAI)
OPENAI_API_KEY=sk-...

# Redis (optional for MVP)
REDIS_URL=redis://localhost:6379

# File Storage (S3-compatible, optional for local)
# S3_BUCKET=
# S3_REGION=
# S3_ACCESS_KEY=
# S3_SECRET_KEY=
# S3_ENDPOINT=  # for R2/MinIO
```

### Generate `NEXTAUTH_SECRET`

```bash
openssl rand -base64 32
```

---

## 4. Setup Steps

### 4.1 Clone & Install

```bash
cd F:\Zesty
pnpm install
```

### 4.2 Database Setup

**Option A: Hosted database (recommended – no Docker needed)**

Use [Supabase](https://supabase.com) or [Neon](https://neon.tech) – both offer free tiers.

1. Create a project (Supabase or Neon)
2. Copy the **connection string** from the dashboard
3. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
   ```
4. Run migrations (see below)

**Option B: Docker**

```bash
docker compose up -d
```

Then set `DATABASE_URL` to `postgresql://postgres:dev@localhost:5432/resumedoctor_dev` in `.env.local`.

**Run migrations (either option):**

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed (optional)
pnpm prisma db seed
```

### 4.3 Start Development

```bash
# Start Next.js dev server
pnpm dev
```

App: `http://localhost:3000`

---

## 5. Dependency Tree (Visual)

```
ResumeDoctor App
├── next (framework)
├── react / react-dom
├── tailwindcss (styling)
├── @prisma/client (DB)
├── next-auth (auth)
├── openai (AI)
├── @dnd-kit/* (drag-drop)
├── jspdf + html2canvas (PDF export)
└── zod (validation)
```

---

## 6. Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `pnpm dev` | Start Next.js dev server |
| `build` | `pnpm build` | Production build |
| `start` | `pnpm start` | Start production server |
| `lint` | `pnpm lint` | Run ESLint |
| `format` | `pnpm format` | Run Prettier |
| `db:migrate` | `pnpm prisma migrate dev` | Run DB migrations |
| `db:studio` | `pnpm prisma studio` | Open Prisma Studio |
| `db:seed` | `pnpm prisma db seed` | Seed database |
| `test` | `pnpm test` | Run tests |

---

## 7. Troubleshooting

| Issue | Fix |
|-------|-----|
| `PrismaClient` not found | Run `pnpm prisma generate` |
| Port 3000 in use | Use `PORT=3001 pnpm dev` |
| PostgreSQL connection refused | Ensure DB is running; check `DATABASE_URL` |
| OpenAI rate limit | Add Redis caching; check usage |
| PDF export blank | Check CORS; ensure `html2canvas` runs client-side |

---

*Next: See [DEPLOYMENT-REQUIREMENTS.md](./DEPLOYMENT-REQUIREMENTS.md) for production deployment.*
