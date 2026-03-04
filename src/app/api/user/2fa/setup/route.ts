// 2FA setup – generate secret and QR code
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSecret, generateOTPAuthUrl, generateQRCodeDataUrl } from "@/lib/totp";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, twoFactorEnabled: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
  }

  const secret = generateSecret();
  const otpauthUrl = generateOTPAuthUrl(user.email!, secret);
  const qrDataUrl = await generateQRCodeDataUrl(otpauthUrl);

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret },
  });

  return NextResponse.json({
    secret,
    qrCode: qrDataUrl,
  });
}
