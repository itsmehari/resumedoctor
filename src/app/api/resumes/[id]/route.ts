// WBS 3.2, 3.3 – Resume get, update, delete
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";

const MAX_VERSIONS = 10;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, user: { email: session.user.email } },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...resume,
    content: parseResumeContent(resume.content),
  });
}

const updateSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.record(z.unknown()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, user: { email: session.user.email } },
    include: { versions: true },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updates: { title?: string; content?: object; version?: number } = {};

    if (parsed.data.title !== undefined) {
      updates.title = parsed.data.title;
    }

    if (parsed.data.content !== undefined) {
      const newVersion = resume.version + 1;

      await prisma.resumeVersion.create({
        data: {
          resumeId: id,
          version: newVersion,
          content: parsed.data.content as object,
        },
      });

      updates.content = parsed.data.content as object;
      updates.version = newVersion;

      // Prune old versions (keep last MAX_VERSIONS)
      const allVersions = await prisma.resumeVersion.findMany({
        where: { resumeId: id },
        orderBy: { version: "desc" },
        select: { version: true },
      });
      if (allVersions.length > MAX_VERSIONS) {
        const toDelete = allVersions
          .slice(MAX_VERSIONS)
          .map((v) => v.version);
        await prisma.resumeVersion.deleteMany({
          where: { resumeId: id, version: { in: toDelete } },
        });
      }
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({
      ...updated,
      content: parseResumeContent(updated.content),
    });
  } catch (err) {
    console.error("Update resume error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, user: { email: session.user.email } },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
