import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { subHours } from "date-fns";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { sessionUserEmail } from "@/lib/session-user";

const MAX_RESEND_PER_HOUR = 3;

export async function POST() {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true, emailVerified: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (user.emailVerified) {
    return NextResponse.json({ error: "Email is already verified." }, { status: 400 });
  }

  const windowStart = subHours(new Date(), 1);
  const recent = await prisma.otpAttempt.count({
    where: {
      email: sessionEmail,
      type: "resend_verify",
      success: true,
      createdAt: { gte: windowStart },
    },
  });
  if (recent >= MAX_RESEND_PER_HOUR) {
    return NextResponse.json(
      { error: "Too many verification emails. Try again in an hour." },
      { status: 429 }
    );
  }

  const verifyToken = randomBytes(32).toString("hex");
  const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.verificationToken.deleteMany({
    where: { identifier: sessionEmail },
  });
  await prisma.verificationToken.create({
    data: {
      identifier: sessionEmail,
      token: verifyToken,
      expires: verifyExpires,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyLink = `${baseUrl}/verify-email#token=${verifyToken}`;

  const emailResult = await sendVerificationEmail(sessionEmail, verifyLink);
  await prisma.otpAttempt.create({
    data: {
      email: sessionEmail,
      type: "resend_verify",
      success: emailResult.ok,
    },
  });

  if (!emailResult.ok) {
    return NextResponse.json(
      { error: "Could not send email. Try again later or contact support." },
      { status: 503 }
    );
  }

  return NextResponse.json({ message: "Verification email sent. Check your inbox." });
}
