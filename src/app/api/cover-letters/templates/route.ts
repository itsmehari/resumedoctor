// User's saved cover letter templates
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
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const templates = await prisma.coverLetterTemplate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ templates });
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  content: z.string(),
  templateId: z.enum(["professional", "minimal", "modern", "classic", "bold", "compact"]).optional(),
  tone: z.enum(["formal", "casual", "technical"]).optional(),
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
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const template = await prisma.coverLetterTemplate.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        content: parsed.data.content,
        templateId: parsed.data.templateId ?? "professional",
        tone: parsed.data.tone ?? "formal",
      },
    });
    return NextResponse.json(template);
  } catch (err) {
    console.error("Create cover letter template error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
