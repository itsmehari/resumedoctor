// Public: resend signup verification for password accounts (no session). Anti-enumeration-safe copy.
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { subHours } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { normalizeEmail } from "@/lib/email-normalize";

const MAX_PER_HOUR = 3;
const bodySchema = z.object({
  email: z.string().email("Invalid email address"),
});

const PUBLIC_MESSAGE = {
  message:
    "If that email is registered with a password and still needs verification, we sent a link. Check your inbox.",
};

export async function POST(req: Request) {
  let emailRaw = "";
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    emailRaw = parsed.data.email;
    const email = normalizeEmail(emailRaw);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true, passwordHash: true },
    });

    if (!user?.passwordHash || user.emailVerified) {
      return NextResponse.json(PUBLIC_MESSAGE);
    }

    const windowStart = subHours(new Date(), 1);
    const recent = await prisma.otpAttempt.count({
      where: {
        email,
        type: "request_verify_public",
        success: true,
        createdAt: { gte: windowStart },
      },
    });
    if (recent >= MAX_PER_HOUR) {
      return NextResponse.json(
        { error: "Too many verification emails. Try again in an hour." },
        { status: 429 }
      );
    }

    const verifyToken = randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verifyToken,
        expires: verifyExpires,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/verify-email#token=${verifyToken}`;

    const emailResult = await sendVerificationEmail(email, verifyLink);
    await prisma.otpAttempt.create({
      data: {
        email,
        type: "request_verify_public",
        success: emailResult.ok,
      },
    });

    if (!emailResult.ok) {
      return NextResponse.json(
        { error: "Could not send email. Try again later or contact support." },
        { status: 503 }
      );
    }

    return NextResponse.json(PUBLIC_MESSAGE);
  } catch (err) {
    console.error("request-verification-email:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
