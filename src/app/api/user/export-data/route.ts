// User – Download all user data (GDPR-style export)
import { NextResponse } from "next/server";
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
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      subscription: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      templateId: true,
      version: true,
      createdAt: true,
      updatedAt: true,
      content: true,
    },
  });

  const exportLogs = await prisma.exportLog.findMany({
    where: { userId: user.id },
    select: { id: true, resumeId: true, format: true, createdAt: true },
  });

  const data = {
    exportedAt: new Date().toISOString(),
    user,
    resumes,
    exportLogs,
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="resumedoctor-data-${user.id}.json"`,
    },
  });
}
