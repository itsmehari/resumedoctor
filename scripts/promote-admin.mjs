/**
 * One-shot: set User.role = "admin" for PROMOTE_ADMIN_EMAIL.
 *
 * Usage (production DB URL in env):
 *   PROMOTE_ADMIN_EMAIL=you@example.com node --env-file=.env.local scripts/promote-admin.mjs
 *
 * Or:
 *   set DATABASE_URL=... & set PROMOTE_ADMIN_EMAIL=... & node scripts/promote-admin.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const raw = process.env.PROMOTE_ADMIN_EMAIL?.trim();
  if (!raw) {
    console.error("Missing PROMOTE_ADMIN_EMAIL (your account email).");
    process.exit(1);
  }
  const email = raw.toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    console.error("Sign up first, then run this script again.");
    process.exit(1);
  }

  if (user.role === "admin") {
    console.log(`Already admin: ${user.email}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "admin" },
  });

  console.log(`OK — promoted to admin: ${user.email}`);
  console.log("Sign in at /admin/login with email + password.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
