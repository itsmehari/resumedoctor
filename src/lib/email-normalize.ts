/** Canonical email form for DB lookups and comparisons (signup stores lowercase). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
