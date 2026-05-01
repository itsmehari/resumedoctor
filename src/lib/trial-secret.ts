function isProductionDeploy(): boolean {
  return (
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"
  );
}

/**
 * Secret bytes for trial session JWT. In production, returns null if neither
 * TRIAL_SESSION_SECRET nor NEXTAUTH_SECRET is set (fail closed).
 */
export function getTrialJwtSecretBytes(): Uint8Array | null {
  const raw = process.env.TRIAL_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!raw) {
    if (isProductionDeploy()) return null;
    return new TextEncoder().encode("trial-secret-change-me");
  }
  return new TextEncoder().encode(raw);
}

/** Use when issuing a trial cookie; production requires configured secrets. */
export function requireTrialJwtSecretBytes(): Uint8Array {
  const b = getTrialJwtSecretBytes();
  if (!b) {
    throw new Error(
      "TRIAL_SESSION_SECRET or NEXTAUTH_SECRET must be set to issue trial sessions in production"
    );
  }
  return b;
}
