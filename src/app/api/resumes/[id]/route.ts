// WBS 3.2, 3.3, 4.6 – Resume get, update, delete (supports trial, template migration)
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseResumeContent } from "@/lib/resume-utils";
import { migrateResumeContent } from "@/lib/template-migration";
import { getResumeAuth } from "@/lib/trial-auth";
import { getTemplateAccessContext, resolveToAllowedTemplateId } from "@/lib/template-access";
import { validateResumeContentContact } from "@/lib/resume-contact-validate";

const MAX_VERSIONS = 10;

export async function GET(
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

  const parsed = parseResumeContent(resume.content);
  const migrated = migrateResumeContent(parsed, resume.templateId);
  return NextResponse.json({
    ...resume,
    content: migrated,
  });
}

const updateSchema = z.object({
  title: z.string().max(200).optional(),
  templateId: z.string().max(100).optional(),
  content: z.record(z.unknown()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const resume = await prisma.resume.findFirst({
    where: { id, userId: auth.userId },
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

    const updates: { title?: string; templateId?: string; content?: object; version?: number } = {};

    if (parsed.data.title !== undefined) {
      updates.title = parsed.data.title;
    }
    if (parsed.data.templateId !== undefined) {
      const access = await getTemplateAccessContext();
      if (!access) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const picked = resolveToAllowedTemplateId(parsed.data.templateId, access.allowedTemplateIds);
      if (!picked) {
        return NextResponse.json(
          { error: "This template requires Pro. Upgrade to unlock all 30 designs.", code: "TEMPLATE_LOCKED" },
          { status: 403 }
        );
      }
      updates.templateId = picked;
    }

    if (parsed.data.content !== undefined) {
      const contactCheck = validateResumeContentContact(parsed.data.content);
      if (!contactCheck.ok) {
        return NextResponse.json({ error: contactCheck.message }, { status: 400 });
      }

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

    const contentParsed = parseResumeContent(updated.content);
    const contentMigrated = migrateResumeContent(contentParsed, updated.templateId);
    return NextResponse.json({
      ...updated,
      content: contentMigrated,
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

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
