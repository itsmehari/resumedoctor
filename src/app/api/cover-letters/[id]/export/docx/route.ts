// WBS 8.6 – Cover letter DOCX export
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildCoverLetterDocx } from "@/lib/docx-export";
import { sessionUserEmail } from "@/lib/session-user";

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
