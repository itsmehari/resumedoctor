# ResumeDoctor – Agent Instructions for Cursor

This project uses **role-based development** with Cursor agents. Read this file to understand how to work on ResumeDoctor (resumedoctor.in).

---

## Quick Start for Agents

1. **Read the PRD** → `docs/PRD-ROLE-BASED.md`
2. **Find your role** → Frontend, Backend, DevOps, Design, or Content
3. **Check the WBS** → `docs/WBS-WORK-BREAKDOWN-STRUCTURE.md` for task details
4. **Verify dependencies** → Ensure blocking tasks are done before starting

---

## Role Assignment

When starting work, declare your role in the chat, e.g.:

> "I am working as the **Frontend Agent** on task 3.5 (Drag-and-drop section reordering)."

Or:

> "I am the **Backend Agent** implementing the Resume CRUD API (WBS 3.2)."

---

## Role → File Mapping

| Role | Primary Paths | Key Docs |
|------|---------------|----------|
| **Frontend** | `src/app/`, `src/components/` | PRD § Frontend Agent |
| **Backend** | `src/app/api/`, `prisma/`, `src/lib/` | PRD § Backend Agent |
| **DevOps** | `.github/`, `vercel.json`, `Dockerfile` | PRD § DevOps Agent, DEPLOYMENT-REQUIREMENTS |
| **Design** | `src/templates/`, `public/templates/` | PRD § Design Agent |
| **Content** | `src/app/blog/`, `content/` | PRD § Content Agent |
| **Full-Stack** | Any | PRD § Full-Stack Agent |

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| `docs/WBS-WORK-BREAKDOWN-STRUCTURE.md` | Complete task breakdown with IDs, owners, effort |
| `docs/PRD-ROLE-BASED.md` | Role-specific PRD, acceptance criteria |
| `docs/LOCAL-DEVELOPMENT-SETUP.md` | Dependencies, env vars, setup steps |
| `docs/DEPLOYMENT-REQUIREMENTS.md` | Production checklist, deployment steps |
| `AGENTS.md` | This file – agent quick start |

---

## Conventions

- **File names:** `kebab-case`
- **Branch names:** `feat/wbs-X.Y-description` or `fix/issue-name`
- **Commits:** Reference WBS ID when relevant, e.g. `feat(3.5): add section drag-and-drop`
- **API routes:** REST-style, auth required for user data

---

## Getting Unstuck

- **Blocked by another role?** Check WBS dependency graph; ping or document the blocker
- **Unclear acceptance criteria?** Refer to PRD role section
- **Env/build issues?** See LOCAL-DEVELOPMENT-SETUP.md
- **Deploy questions?** See DEPLOYMENT-REQUIREMENTS.md
