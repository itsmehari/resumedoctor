import type { SuperprofileProductKey } from "@/lib/superprofile-fulfillment";
import { SUPERPROFILE_PRODUCT_KEYS } from "@/lib/superprofile-fulfillment";

const PRODUCT_SET = new Set<string>(SUPERPROFILE_PRODUCT_KEYS);

const WRAP_KEYS = ["data", "payload", "body", "purchase", "order", "payment", "event"] as const;

const EMAIL_KEYS = [
  "email",
  "buyer_email",
  "buyerEmail",
  "customer_email",
  "customerEmail",
  "user_email",
  "userEmail",
  "purchaser_email",
  "purchaserEmail",
] as const;

const ID_KEYS = [
  "idempotencyKey",
  "idempotency_key",
  "payment_id",
  "paymentId",
  "transaction_id",
  "transactionId",
  "order_id",
  "orderId",
  "purchase_id",
  "purchaseId",
  "checkout_id",
  "checkoutId",
  "id",
] as const;

const PRODUCT_KEYS = [
  "productKey",
  "product_key",
  "plan",
  "plan_id",
  "planId",
  "product",
  "sku",
  "productSlug",
  "product_slug",
] as const;

const CREDIT_KEYS = ["credits", "resume_pack_credits", "resumePackCredits"] as const;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Collect root + common nested objects Zapier/Make send after SuperProfile triggers. */
function objectsToScan(root: Record<string, unknown>): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [root];
  for (const k of WRAP_KEYS) {
    const inner = root[k];
    if (isPlainObject(inner)) out.push(inner);
  }
  return out;
}

function firstString(objs: Record<string, unknown>[], keys: readonly string[]): string | undefined {
  for (const obj of objs) {
    for (const key of keys) {
      const v = obj[key];
      if (typeof v === "string" && v.trim() !== "") return v.trim();
    }
  }
  return undefined;
}

function firstScalarString(objs: Record<string, unknown>[], keys: readonly string[]): string | undefined {
  for (const obj of objs) {
    for (const key of keys) {
      const v = obj[key];
      if (typeof v === "number" && Number.isFinite(v)) return String(v);
      if (typeof v === "string" && v.trim() !== "") return v.trim();
    }
  }
  return undefined;
}

function normalizeProductKey(raw: string): SuperprofileProductKey | undefined {
  const t = raw.trim().toLowerCase();
  if (PRODUCT_SET.has(t)) return t as SuperprofileProductKey;
  return undefined;
}

function coerceCredits(objs: Record<string, unknown>[]): number | undefined {
  for (const obj of objs) {
    for (const key of CREDIT_KEYS) {
      const v = obj[key];
      if (v === undefined) continue;
      if (typeof v === "number" && Number.isInteger(v)) return v;
      if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v.trim());
        if (Number.isInteger(n)) return n;
      }
    }
  }
  return undefined;
}

/** Ensure idempotency key meets DB/webhook min length (8). */
export function ensureIdempotencyKeyMinLength(key: string): string {
  const s = key.trim();
  if (s.length >= 8) return s;
  return `superprofile:${s}`;
}

/**
 * Maps nested / snake_case SuperProfile automation payloads into the canonical
 * shape expected by POST /api/webhooks/superprofile.
 */
export function normalizeSuperprofileWebhookPayload(raw: unknown): Record<string, unknown> | null {
  if (Array.isArray(raw) && raw.length === 1 && isPlainObject(raw[0])) {
    return normalizeSuperprofileWebhookPayload(raw[0]);
  }

  if (!isPlainObject(raw)) return null;

  const objs = objectsToScan(raw);

  const email = firstString(objs, EMAIL_KEYS);
  const idRaw = firstScalarString(objs, ID_KEYS);
  const productRaw = firstString(objs, PRODUCT_KEYS);
  const credits = coerceCredits(objs);

  if (!email || !idRaw || !productRaw) return null;

  const productKey = normalizeProductKey(productRaw);
  if (!productKey) return null;

  const out: Record<string, unknown> = {
    idempotencyKey: ensureIdempotencyKeyMinLength(idRaw),
    email,
    productKey,
  };
  if (credits !== undefined) out.credits = credits;
  return out;
}
