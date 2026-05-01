// WBS 11.8 – Start impersonation (admin only)
import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";
import { createImpersonationToken, getImpersonationCookieName } from "@/lib/impersonation";

export async function POST(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (targetUser.role === "admin") {
    return NextResponse.json(
      { error: "Cannot impersonate another admin" },
      { status: 403 }
    );
  }

  const token = await createImpersonationToken(userId, admin.id);
  await logAdminAction({
    action: "admin_impersonate_start",
    adminUserId: admin.id,
    targetUserId: userId,
  });
  const cookieName = getImpersonationCookieName();
  const res = NextResponse.json({ success: true, redirect: "/dashboard" });
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 60, // 30 minutes
    path: "/",
  });
  return res;
}
