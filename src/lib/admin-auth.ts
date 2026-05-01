// Admin API – require admin role + optional MASTER_ADMIN_EMAILS allowlist
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isEmailAllowedForMasterAdmin,
  isEmailAllowedForSuperAdmin,
} from "@/lib/master-admin-config";
import { normalizeEmail } from "@/lib/email-normalize";

export type AdminSessionUser = { id: string; email: string };

/**
 * Admin gate: session role admin + allowlist (if env set) + DB confirms admin.
 * 2FA is not required for admin (optional for end users via Settings).
 */
export async function requireAdmin(): Promise<AdminSessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const email = normalizeEmail(session.user.email);
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return null;
  if (!isEmailAllowedForMasterAdmin(email)) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  });
  if (!user || user.role !== "admin") return null;

  return { id: user.id, email: user.email };
}

/** Sensitive mutations and exports; uses SUPER_ADMIN_EMAILS when set. */
export async function requireSuperAdmin(): Promise<AdminSessionUser | null> {
  const admin = await requireAdmin();
  if (!admin) return null;
  if (!isEmailAllowedForSuperAdmin(admin.email)) return null;
  return admin;
}
