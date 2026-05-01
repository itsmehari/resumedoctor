// 2FA verify – confirm TOTP and enable 2FA
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyToken, generateBackupCodes } from "@/lib/totp";
import { sessionUserEmail } from "@/lib/session-user";

const schema = z.object({
  code: z.string().min(6, "Code required").max(8),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true, twoFactorSecret: true, twoFactorEnabled: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA setup not started. Call /api/user/2fa/setup first." }, { status: 400 });
  }

  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.code?.[0] ?? "Invalid code" },
        { status: 400 }
      );
    }

    const valid = await verifyToken(user.twoFactorSecret, parsed.data.code);
    if (!valid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const backupCodes = generateBackupCodes(8);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: JSON.stringify(backupCodes),
      },
    });

    return NextResponse.json({
      success: true,
      backupCodes,
      message: "2FA enabled. Save these backup codes in a safe place.",
    });
  } catch (err) {
    console.error("2FA verify error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
