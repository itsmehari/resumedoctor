// Admin – delete all NextAuth sessions for a user (force re-login)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (user.role === "admin") {
    return NextResponse.json(
      { error: "Revoking all sessions for another admin is blocked." },
      { status: 403 }
    );
  }

  const result = await prisma.session.deleteMany({ where: { userId } });

  await logAdminAction({
    action: "admin_revoke_sessions",
    adminUserId: admin.id,
    targetUserId: userId,
    meta: { deletedCount: result.count },
  });

  return NextResponse.json({ success: true, deletedCount: result.count });
}
