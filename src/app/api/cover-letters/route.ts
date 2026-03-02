// WBS 8.2 – Cover letter list & create
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const letters = await prisma.coverLetter.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      resume: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json(letters);
}

const createSchema = z.object({
  title: z.string().max(200).optional(),
  resumeId: z.string().optional(),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = createSchema.safeParse(body);
    const data = parsed.success ? parsed.data : {};

    const letter = await prisma.coverLetter.create({
      data: {
        userId: user.id,
        title: data.title || "Untitled Cover Letter",
        resumeId: data.resumeId || null,
        company: data.company || null,
        role: data.role || null,
        content: "",
      },
    });

    return NextResponse.json(letter);
  } catch (err) {
    console.error("Create cover letter error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
