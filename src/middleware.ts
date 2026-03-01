// WBS 2.5 – Protected routes middleware (supports trial)
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = ["/dashboard", "/settings", "/resumes"];
const authPaths = ["/login", "/signup"];
const TRIAL_COOKIE = "trial_session";

async function hasValidTrialCookie(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(TRIAL_COOKIE)?.value;
  if (!cookie) return false;
  try {
    const secret = new TextEncoder().encode(
      process.env.TRIAL_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "trial-secret-change-me"
    );
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
    const hasTrial = isResumePath ? await hasValidTrialCookie(req) : false;
    if (hasTrial) {
      return NextResponse.next();
    }
    const loginUrl = new URL(isResumePath ? "/try" : "/login", req.url);
    if (!isResumePath) loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/resumes/:path*",
    "/try/templates",
    "/login",
    "/signup",
  ],
};
