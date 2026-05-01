// WBS 9.6 – Job application tracking (save / update status)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

const schema = z.object({
  status: z.enum(["saved", "applied", "interviewing", "rejected", "offer"]),
  notes: z.string().max(1000).optional(),
  appliedAt: z.string().datetime().optional(),
});

export async function POST(
  req: NextRequest,
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
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const application = await prisma.jobApplication.upsert({
    where: { userId_jobId: { userId: user.id, jobId: id } },
    create: {
      userId: user.id,
      jobId: id,
      status: parsed.data.status,
      notes: parsed.data.notes,
      appliedAt: parsed.data.appliedAt ? new Date(parsed.data.appliedAt) : undefined,
    },
    update: {
      status: parsed.data.status,
      notes: parsed.data.notes,
      appliedAt: parsed.data.appliedAt ? new Date(parsed.data.appliedAt) : undefined,
    },
  });

  return NextResponse.json({ application });
}

export async function DELETE(
  _req: NextRequest,
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
  await prisma.jobApplication.deleteMany({
    where: { userId: user.id, jobId: id },
  });

  return NextResponse.json({ success: true });
}
