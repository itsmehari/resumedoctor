/**
 * Owner-only admin surface. If MASTER_ADMIN_EMAILS is unset or empty, any user
 * with role "admin" may access admin APIs (legacy dev/single-operator setups).
 * In production, set comma-separated lowercase emails to restrict access.
 */
export function getMasterAdminEmailAllowlist(): Set<string> | null {
  const raw = process.env.MASTER_ADMIN_EMAILS?.trim();
  if (!raw) return null;
  const set = new Set<string>();
  for (const part of raw.split(",")) {
    const e = part.trim().toLowerCase();
    if (e) set.add(e);
  }
  return set.size > 0 ? set : null;
}

export function isEmailAllowedForMasterAdmin(email: string): boolean {
  const allow = getMasterAdminEmailAllowlist();
  if (!allow) return true;
  return allow.has(email.trim().toLowerCase());
}

/**
 * Destructive / sensitive admin actions (CSV export, impersonation, promos, trial
 * decisions, user mutations, session revoke) require this allowlist when set.
 * If unset or empty, any user who passes requireAdmin is treated as super admin.
 */
export function getSuperAdminEmailAllowlist(): Set<string> | null {
  const raw = process.env.SUPER_ADMIN_EMAILS?.trim();
  if (!raw) return null;
  const set = new Set<string>();
  for (const part of raw.split(",")) {
    const e = part.trim().toLowerCase();
    if (e) set.add(e);
  }
  return set.size > 0 ? set : null;
}

export function isEmailAllowedForSuperAdmin(email: string): boolean {
  const allow = getSuperAdminEmailAllowlist();
  if (!allow) return true;
  return allow.has(email.trim().toLowerCase());
}
