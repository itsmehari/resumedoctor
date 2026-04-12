import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { fulfillSuperprofilePurchase, SUPERPROFILE_PRODUCT_KEYS } from "@/lib/superprofile-fulfillment";

export const runtime = "nodejs";

const bodySchema = z.object({
  idempotencyKey: z.string().min(8).max(256),
  email: z.string().email(),
  productKey: z.enum(SUPERPROFILE_PRODUCT_KEYS),
  credits: z.number().int().min(1).max(100).optional(),
});

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function verifyWebhookSecret(req: Request): boolean {
  const expected = process.env.SUPERPROFILE_WEBHOOK_SECRET;
  if (!expected || expected.length < 16) return false;

  const auth = req.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  if (bearer && secretsMatch(bearer, expected)) return true;

  const header = req.headers.get("x-superprofile-webhook-secret");
  if (header && secretsMatch(header.trim(), expected)) return true;

  return false;
}

export async function POST(req: Request) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.SUPERPROFILE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { idempotencyKey, email, productKey, credits } = parsed.data;
  const payloadSnapshot: Prisma.InputJsonValue | undefined =
    typeof json === "object" && json !== null ? (json as Prisma.InputJsonValue) : undefined;

  if (productKey === "resume_pack") {
    // credits optional; other products ignore credits
  } else if (credits !== undefined) {
    return NextResponse.json(
      { error: "credits is only allowed when productKey is resume_pack" },
      { status: 400 }
    );
  }

  const result = await fulfillSuperprofilePurchase({
    idempotencyKey,
    email,
    productKey,
    credits: productKey === "resume_pack" ? credits : undefined,
    payloadSnapshot,
  });

  if (result.ok && result.duplicate) {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  if (result.ok && !result.duplicate) {
    return NextResponse.json({ ok: true, userId: result.userId });
  }
  // 200 so Zapier/custom automations do not infinite-retry on missing account
  return NextResponse.json({
    ok: false,
    reason: "user_not_found",
    hint: "Buyer must sign up on ResumeDoctor with the same email used at checkout.",
  });
}
