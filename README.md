# Zesty – Resume & CV Builder

India-first resume builder with ATS-friendly templates, AI assistance, and job-matching tools.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (or npm)
- PostgreSQL 15+ (or [Docker](https://www.docker.com/products/docker-desktop/))

### Setup

```bash
# Install dependencies
pnpm install
# or: npm install

# Copy environment file
cp .env.example .env.local

# Add your DATABASE_URL and NEXTAUTH_SECRET to .env.local
# Generate NEXTAUTH_SECRET: openssl rand -base64 32

# Generate Prisma client & run migrations
pnpm prisma generate
pnpm prisma migrate dev --name init

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database (Docker)

**Option 1 – Docker Compose (recommended):**

```bash
docker compose up -d
npx prisma migrate dev --name init
```

**Option 2 – Single container:**

```bash
docker run -d --name zesty-db -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=zesty_dev -p 5432:5432 postgres:15
npx prisma migrate dev --name init
```

Then ensure `.env.local` has:

```
DATABASE_URL="postgresql://postgres:dev@localhost:5432/zesty_dev"
```

> **Note:** Auth, signup, and resume features require a running database. Static pages (home, login, signup) load without it, but API calls will fail.

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API
├── components/    # Reusable UI components
├── lib/           # Utilities, auth, prisma
└── types/         # TypeScript definitions
prisma/
└── schema.prisma  # Database schema
docs/              # WBS, PRD, deployment guides
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Development Guide

See [AGENTS.md](./AGENTS.md) for role-based workflow and [docs/PRD-ROLE-BASED.md](./docs/PRD-ROLE-BASED.md) for task details.

## License

Private – All rights reserved.
