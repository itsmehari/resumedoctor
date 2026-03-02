// Admin – Export reports (CSV)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "users";

  if (type === "users") {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        subscription: true,
        createdAt: true,
      },
    });
    const headers = ["id", "email", "name", "subscription", "createdAt"];
    const csv = [
      headers.join(","),
      ...users.map((u) =>
        headers
          .map((h) => {
            const v = (u as Record<string, unknown>)[h];
            const s = String(v ?? "");
            return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      ),
    ].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=users-export.csv",
      },
    });
  }

  if (type === "exports") {
    const logs = await prisma.exportLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true } },
        resume: { select: { title: true } },
      },
      take: 5000,
    });
    const headers = ["id", "userId", "resumeId", "format", "userEmail", "resumeTitle", "createdAt"];
    const csv = [
      headers.join(","),
      ...logs.map((l) =>
        [
          l.id,
          l.userId,
          l.resumeId,
          l.format,
          (l.user as { email?: string })?.email ?? "",
          (l.resume as { title?: string })?.title ?? "",
          l.createdAt.toISOString(),
        ]
          .map((s) => (String(s).includes(",") || String(s).includes('"') ? `"${String(s).replace(/"/g, '""')}"` : s))
          .join(",")
      ),
    ].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=exports-log.csv",
      },
    });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
