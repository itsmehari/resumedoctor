// Pro Link – claim, check, or release a vanity slug for a resume.
//
// GET    ?check=hari-krishnan  → { available, error?, message? }   (debounced UI use)
// PATCH  body: { vanitySlug }  → { ok, url, slug }                  (claim or rename)
// DELETE                       → { ok: true }                       (release back to random)
//
// Auth: resume must belong to the caller. Pro Link entitlement is required to claim
// or rename a vanity (the "Pro Link" feature itself); checking availability is allowed
// without entitlement so the upgrade UI can show "yes, this URL is free" before paywall.
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";
import { getProLinkStatus } from "@/lib/pro-link-entitlement";
import { normaliseVanitySlug, validateVanitySlug } from "@/lib/vanity-slug";

const baseUrl = () => process.env.NEXT_PUBLIC_APP_URL || "https://resumedoctor.in";

async function loadUserEntitlement(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscription: true,
      proLinkActive: true,
      proLinkExpiresAt: true,
      proLinkSource: true,
    },
  });
  return user ? getProLinkStatus(user) : { active: false, source: null, expiresAt: null, isImplicit: false };
}

// ── GET: availability check ─────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(req.url);
  const candidate = url.searchParams.get("check");
  if (!candidate) {
    return NextResponse.json({ error: "Missing ?check=" }, { status: 400 });
  }

  const slug = normaliseVanitySlug(candidate);
  const validation = validateVanitySlug(slug);
  if (!validation.ok) {
    return NextResponse.json({ available: false, error: validation.error, message: validation.message });
  }

  // Owner check (you must own the resume even to check, so we don't expose existence enumeration).
  const owns = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
    select: { id: true, vanitySlug: true },
  });
  if (!owns) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  // Allow the user to "re-claim" their own current slug (idempotent).
  if (owns.vanitySlug === slug) {
    return NextResponse.json({ available: true, current: true });
  }

  const conflictResume = await prisma.resume.findFirst({
    where: {
      OR: [{ vanitySlug: slug }, { publicSlug: slug }],
    },
    select: { id: true },
  });
  if (conflictResume) {
    return NextResponse.json({ available: false, error: "taken", message: "That URL is already in use." });
  }

  return NextResponse.json({ available: true });
}

// ── PATCH: claim or rename ──────────────────────────────────────────────────
const patchSchema = z.object({
  vanitySlug: z.string().min(3).max(30),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ent = await loadUserEntitlement(auth.userId);
  if (!ent.active) {
    return NextResponse.json(
      {
        error: "Pro Link required",
        code: "PRO_LINK_REQUIRED",
        message:
          "Custom resume URLs are part of Pro Link. Upgrade to Pro annual (included) or buy the Pro Link add-on (₹99/mo).",
      },
      { status: 402 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const slug = normaliseVanitySlug(parsed.data.vanitySlug);

  const validation = validateVanitySlug(slug);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error, message: validation.message ?? "Invalid URL." },
      { status: 422 }
    );
  }

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
    select: { id: true, publicSlug: true, vanitySlug: true },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  if (resume.vanitySlug === slug) {
    return NextResponse.json({
      ok: true,
      slug,
      url: `${baseUrl()}/r/${slug}`,
      unchanged: true,
    });
  }

  // Reserve atomically by attempting the unique-key write; collision throws P2002.
  try {
    const updated = await prisma.resume.update({
      where: { id: resume.id },
      data: { vanitySlug: slug },
      select: { vanitySlug: true, publicSlug: true },
    });
    return NextResponse.json({
      ok: true,
      slug: updated.vanitySlug,
      url: `${baseUrl()}/r/${updated.vanitySlug}`,
      // legacy random slug still works — surface it so the UI can show it for redirect history
      legacySlug: updated.publicSlug,
    });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      return NextResponse.json(
        { error: "taken", message: "That URL is already in use." },
        { status: 409 }
      );
    }
    console.error("[vanity-slug] PATCH failed", err);
    return NextResponse.json({ error: "Failed to claim slug" }, { status: 500 });
  }
}

// ── DELETE: release vanity (legacy publicSlug remains) ──────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
    select: { id: true },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  await prisma.resume.update({
    where: { id: resume.id },
    data: { vanitySlug: null },
  });

  return NextResponse.json({ ok: true });
}
