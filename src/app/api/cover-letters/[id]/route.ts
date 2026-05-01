// WBS 8.2 – Cover letter get, update, delete
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: user.id },
    include: { resume: { select: { id: true, title: true } } },
  });

  if (!letter) {
    return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
  }

  return NextResponse.json(letter);
}

const updateSchema = z.object({
  title: z.string().max(200).optional(),
  company: z.string().max(200).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  resumeId: z.string().optional().nullable(),
  content: z.string().optional(),
  templateId: z.enum(["professional", "minimal", "modern", "classic", "bold", "compact"]).optional(),
  tone: z.enum(["formal", "casual", "technical"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: user.id },
  });

  if (!letter) {
    return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.coverLetter.update({
      where: { id },
      data: parsed.data as Record<string, unknown>,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update cover letter error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;
  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: user.id },
  });

  if (!letter) {
    return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
  }

  await prisma.coverLetter.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
