// WBS 11.8 – End impersonation
import { NextResponse } from "next/server";
import { getImpersonationCookieName } from "@/lib/impersonation";

export async function POST() {
  const res = NextResponse.json({ success: true, redirect: "/admin/users" });
  res.cookies.delete(getImpersonationCookieName());
  return res;
}
