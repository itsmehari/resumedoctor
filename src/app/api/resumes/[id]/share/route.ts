// Phase 1.3 – Shareable resume link
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResumeAuth } from "@/lib/trial-auth";
import crypto from "crypto";

function generateSlug(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 10);
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
    select: { id: true, publicSlug: true, title: true, templateId: true, content: true },
  });
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  let slug = resume.publicSlug;
  if (!slug) {
    for (let i = 0; i < 5; i++) {
      const candidate = generateSlug();
      const exists = await prisma.resume.findUnique({
        where: { publicSlug: candidate },
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumedoctor.in";
  const url = `${baseUrl}/r/${slug}`;
  return NextResponse.json({ slug, url });
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

  await prisma.resume.update({
    where: { id },
    data: { publicSlug: null },
  });
  return NextResponse.json({ success: true });
}
