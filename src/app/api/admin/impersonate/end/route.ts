// WBS 11.8 – End impersonation
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { getImpersonationCookieName } from "@/lib/impersonation";

export async function POST() {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await logAdminAction({
    action: "admin_impersonate_end",
    adminUserId: admin.id,
  });
  const res = NextResponse.json({ success: true, redirect: "/admin/users" });
  res.cookies.delete(getImpersonationCookieName());
  return res;
}
