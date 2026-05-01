// User-facing export history – current user's own export logs
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

export async function GET() {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const logs = await prisma.exportLog.findMany({
    where: { userId: user.id },
    include: {
      resume: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const items = logs.map((log) => ({
    id: log.id,
    resumeId: log.resumeId,
    resumeTitle: log.resume?.title ?? "Untitled",
    format: log.format,
    createdAt: log.createdAt,
  }));

  return NextResponse.json({ logs: items });
}
