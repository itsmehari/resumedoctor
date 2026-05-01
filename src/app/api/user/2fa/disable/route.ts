// 2FA disable – requires password and current TOTP or backup code
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { verifyToken } from "@/lib/totp";
import { sessionUserEmail } from "@/lib/session-user";

const schema = z.object({
  password: z.string().min(1, "Password required"),
  code: z.string().min(6, "Code required").max(10),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true, passwordHash: true, twoFactorSecret: true, twoFactorEnabled: true, twoFactorBackupCodes: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.twoFactorEnabled || !user.passwordHash) {
    return NextResponse.json({ error: "2FA not enabled or password required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.password?.[0] ?? parsed.error.flatten().fieldErrors.code?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const validPassword = await compare(parsed.data.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    let codeValid = false;
    if (user.twoFactorSecret && parsed.data.code.length <= 8) {
      codeValid = await verifyToken(user.twoFactorSecret, parsed.data.code);
    }
    if (!codeValid && user.twoFactorBackupCodes) {
      const codes: string[] = JSON.parse(user.twoFactorBackupCodes);
      const idx = codes.indexOf(parsed.data.code);
      if (idx >= 0) {
        codeValid = true;
        codes.splice(idx, 1);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
            twoFactorBackupCodes: null,
          },
        });
        return NextResponse.json({
          success: true,
          message: "2FA disabled. Backup code was used – regenerate backup codes if you re-enable 2FA.",
        });
      }
    }

    if (!codeValid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      },
    });

    return NextResponse.json({ success: true, message: "2FA disabled." });
  } catch (err) {
    console.error("2FA disable error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
