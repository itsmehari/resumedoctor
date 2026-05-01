// WBS 2.5 – Protected routes middleware (supports trial)
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  getMasterAdminEmailAllowlist,
  isEmailAllowedForMasterAdmin,
} from "@/lib/master-admin-config";
import { getTrialJwtSecretBytes } from "@/lib/trial-secret";

const protectedPaths = ["/dashboard", "/settings", "/resumes", "/cover-letters"];
const adminPaths = ["/admin"];
const authPaths = ["/login", "/signup"];
const TRIAL_COOKIE = "trial_session";

function clientIpFromRequest(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "";
}

function isAdminIpAllowed(req: NextRequest): boolean {
  const raw = process.env.ADMIN_IP_ALLOWLIST?.trim();
  if (!raw) return true;
  const allowed = new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  if (allowed.size === 0) return true;
  const ip = clientIpFromRequest(req);
  return ip !== "" && allowed.has(ip);
}

async function hasValidTrialCookie(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(TRIAL_COOKIE)?.value;
  if (!cookie) return false;
  const secret = getTrialJwtSecretBytes();
  if (!secret) return false;
  try {
    await jwtVerify(cookie, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected = protectedPaths.some((p) =>
    pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));
  const isResumePath = pathname.startsWith("/resumes");
  const isTryTemplates = pathname === "/try/templates";

  if (isTryTemplates && !token) {
    const hasTrial = await hasValidTrialCookie(req);
    if (!hasTrial) {
      return NextResponse.redirect(new URL("/try", req.url));
    }
    return NextResponse.next();
  }

  if (isProtected && !token) {
    const hasTrial = await hasValidTrialCookie(req);
    const trialAllowedPaths = isResumePath || pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    if (hasTrial && trialAllowedPaths) {
      return NextResponse.next();
    }
    const loginUrl = new URL(isResumePath ? "/try" : "/login", req.url);
    if (!isResumePath) {
      loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    } else {
      loginUrl.searchParams.set("reason", "resume");
      loginUrl.searchParams.set("returnTo", pathname + req.nextUrl.search);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isAdminPath = adminPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAdminLoginPage = pathname === "/admin/login";
  if (isAdminPath) {
    const allowlist = getMasterAdminEmailAllowlist();
    const tokenEmail = (token as { email?: string } | null)?.email;

    if (isAdminLoginPage && token) {
      const role = (token as { role?: string }).role;
      if (role === "admin") {
        if (allowlist && (!tokenEmail || !isEmailAllowedForMasterAdmin(tokenEmail))) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (!isAdminLoginPage && !token) {
      const adminLoginUrl = new URL("/admin/login", req.url);
      adminLoginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
    if (!isAdminLoginPage && token) {
      const role = (token as { role?: string }).role;
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (allowlist && (!tokenEmail || !isEmailAllowedForMasterAdmin(tokenEmail))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (!isAdminIpAllowed(req)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/resumes/:path*",
    "/cover-letters/:path*",
    "/admin/:path*",
    "/try/templates",
    "/login",
    "/signup",
  ],
};
