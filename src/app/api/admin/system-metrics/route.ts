// Admin – read-only abuse / ops counters (OtpAttempt, IpRateLimit)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    otpSendOk24h,
    otpSendFail24h,
    otpVerifyOk24h,
    otpVerifyFail24h,
    otpTotal7d,
    ipRateActiveRows,
  ] = await Promise.all([
    prisma.otpAttempt.count({
      where: { type: "send", success: true, createdAt: { gte: oneDayAgo } },
    }),
    prisma.otpAttempt.count({
      where: { type: "send", success: false, createdAt: { gte: oneDayAgo } },
    }),
    prisma.otpAttempt.count({
      where: { type: "verify", success: true, createdAt: { gte: oneDayAgo } },
    }),
    prisma.otpAttempt.count({
      where: { type: "verify", success: false, createdAt: { gte: oneDayAgo } },
    }),
    prisma.otpAttempt.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.ipRateLimit.count({ where: { windowEnd: { gte: now } } }),
  ]);

  const sendTotal = otpSendOk24h + otpSendFail24h;
  const verifyTotal = otpVerifyOk24h + otpVerifyFail24h;

  return NextResponse.json({
    generatedAt: now.toISOString(),
    otp: {
      last24h: {
        send: { success: otpSendOk24h, fail: otpSendFail24h },
        verify: { success: otpVerifyOk24h, fail: otpVerifyFail24h },
        sendSuccessRatePct: sendTotal > 0 ? Math.round((otpSendOk24h / sendTotal) * 1000) / 10 : null,
        verifySuccessRatePct:
          verifyTotal > 0 ? Math.round((otpVerifyOk24h / verifyTotal) * 1000) / 10 : null,
      },
      totalAttemptsLast7d: otpTotal7d,
    },
    ipRateLimit: {
      activeWindowRows: ipRateActiveRows,
    },
  });
}
