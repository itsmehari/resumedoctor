import type { Session } from "next-auth";
import { normalizeEmail } from "@/lib/email-normalize";

/** Session email normalized for Prisma `User.email` lookups. */
export function sessionUserEmail(session: Session | null): string | null {
  const raw = session?.user?.email;
  if (!raw) return null;
  return normalizeEmail(raw);
}
