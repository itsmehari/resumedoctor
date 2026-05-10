// Phase 1.3 – Shareable resume link
// Pro Link – also returns vanity slug, view counter and entitlement flag so the
// share popover can render the analytics + custom-URL UI off one round-trip.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";
import { getProLinkStatus } from "@/lib/pro-link-entitlement";
import crypto from "crypto";

function generateSlug(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 10);
}

function buildUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumedoctor.in";
  return `${baseUrl}/r/${slug}`;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
    select: {
      id: true,
      publicSlug: true,
      vanitySlug: true,
      viewCount: true,
      lastViewedAt: true,
    },
  });
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  let slug = resume.publicSlug;
  if (!slug) {
    for (let i = 0; i < 5; i++) {
      const candidate = generateSlug();
      const exists = await prisma.resume.findFirst({
        where: {
          OR: [{ publicSlug: candidate }, { vanitySlug: candidate }],
        },
      });
      if (!exists) {
        slug = candidate;
        break;
      }
    }
    if (!slug) {
      return NextResponse.json(
        { error: "Failed to generate share link" },
        { status: 500 }
      );
    }
    await prisma.resume.update({
      where: { id: resume.id },
      data: { publicSlug: slug },
    });
  }

  // Resolve Pro Link status — the canonical share URL prefers vanity if present and entitled.
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      subscription: true,
      proLinkActive: true,
      proLinkExpiresAt: true,
      proLinkSource: true,
    },
  });
  const proLink = user ? getProLinkStatus(user) : { active: false, source: null, expiresAt: null, isImplicit: false };

  const canonicalSlug =
    proLink.active && resume.vanitySlug ? resume.vanitySlug : slug;

  return NextResponse.json({
    slug: canonicalSlug,
    url: buildUrl(canonicalSlug),
    publicSlug: slug,
    vanitySlug: resume.vanitySlug,
    viewCount: resume.viewCount,
    lastViewedAt: resume.lastViewedAt,
    proLinkActive: proLink.active,
    proLinkSource: proLink.source,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
  });
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  // Unpublishing clears BOTH the random and vanity slugs — full unshare.
  await prisma.resume.update({
    where: { id },
    data: { publicSlug: null, vanitySlug: null },
  });
  return NextResponse.json({ success: true });
}
