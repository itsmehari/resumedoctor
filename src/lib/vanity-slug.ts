// Vanity-slug validation + reservation rules for Pro Link.
//
// We deliberately keep both lists short and human-readable. Anything more
// sophisticated (Levenshtein checks, ML profanity scoring, multi-language
// blocklists) belongs in a follow-up — for launch, simple is correct.

const RESERVED_WORDS = new Set([
  // Routing collisions — must NEVER be claimable.
  "admin", "api", "r", "try", "signup", "login", "logout", "auth",
  "pricing", "templates", "blog", "examples", "lp", "resume-link",
  "dashboard", "account", "settings", "verify-email", "verify-trial",
  "forgot-password", "reset-password", "checkout", "billing",
  "cover-letters", "interview-prep", "jobs", "import", "share",
  "robots", "sitemap", "favicon", "manifest",
  // Brand / placeholder.
  "resumedoctor", "resume-doctor", "your-name", "example", "test", "demo",
  // Generic resume words that would confuse navigation.
  "resume", "cv", "profile", "u", "user", "users",
]);

// Minimal profanity blocklist. Aggressive expansion is a follow-up.
const PROFANITY = new Set([
  "fuck", "shit", "bitch", "cunt", "asshole", "dickhead",
  "bastard", "whore", "slut", "fag", "nigger", "nigga",
  "rape", "kill", "porn",
]);

const SLUG_RE = /^[a-z][a-z0-9-]{2,29}$/;

export type VanitySlugError =
  | "format"
  | "too-short"
  | "too-long"
  | "leading-char"
  | "double-hyphen"
  | "trailing-hyphen"
  | "reserved"
  | "profanity";

export interface VanitySlugValidation {
  ok: boolean;
  error?: VanitySlugError;
  message?: string;
}

export function validateVanitySlug(raw: string): VanitySlugValidation {
  const slug = raw.trim().toLowerCase();
  if (slug.length < 3) return { ok: false, error: "too-short", message: "Use at least 3 characters." };
  if (slug.length > 30) return { ok: false, error: "too-long", message: "Use at most 30 characters." };
  if (!/^[a-z]/.test(slug)) {
    return { ok: false, error: "leading-char", message: "Must start with a letter." };
  }
  if (slug.includes("--")) {
    return { ok: false, error: "double-hyphen", message: "No double hyphens." };
  }
  if (slug.endsWith("-")) {
    return { ok: false, error: "trailing-hyphen", message: "Cannot end with a hyphen." };
  }
  if (!SLUG_RE.test(slug)) {
    return { ok: false, error: "format", message: "Lowercase letters, digits, and hyphens only." };
  }
  if (RESERVED_WORDS.has(slug)) {
    return { ok: false, error: "reserved", message: "That URL is reserved." };
  }
  // Profanity match: any token between hyphens.
  const tokens = slug.split("-");
  for (const t of tokens) {
    if (PROFANITY.has(t)) {
      return { ok: false, error: "profanity", message: "Please choose a different URL." };
    }
  }
  return { ok: true };
}

export function normaliseVanitySlug(raw: string): string {
  return raw.trim().toLowerCase();
}
