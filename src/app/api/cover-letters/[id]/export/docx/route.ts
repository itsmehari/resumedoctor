// WBS 8.6 – Cover letter DOCX export
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCoverLetterDocx } from "@/lib/docx-export";
import { getResumeAuth } from "@/lib/trial-auth";
import { hasFullProAccess } from "@/lib/subscription-entitlements";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "cover-letter";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auth.isTrial) {
    return NextResponse.json(
      {
        error: "Sign up for full account access to export cover letters for applications.",
        code: "TRIAL_EXPORT_BLOCKED",
      },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, subscription: true, subscriptionExpiresAt: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!hasFullProAccess(user.subscription, user.subscriptionExpiresAt)) {
    return NextResponse.json(
      {
        error: "Upgrade to Pro for Word export — same as resume portal-ready files.",
        code: "PRO_REQUIRED",
      },
      { status: 403 }
    );
  }

  const { id } = await params;
  const letter = await prisma.coverLetter.findFirst({
    where: { id, userId: user.id },
  });

  if (!letter) {
    return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
  }

  const buffer = await buildCoverLetterDocx(
    letter.content,
    letter.title,
    letter.company,
    letter.role
  );

  const filename = `${slugify(letter.title)}-cover-letter.docx`;
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
