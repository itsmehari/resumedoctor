// WBS 2.1, 2.3 – Signup API (with email verification)
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { accounts: { take: 1 } },
    });

    if (existing) {
      // Trial user (no password, no OAuth) → upgrade to full account
      const isTrialUser =
        existing.subscription === "trial" &&
        !existing.passwordHash &&
        existing.accounts.length === 0;

      if (isTrialUser) {
        const passwordHash = await hash(password, 12);
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: name || existing.name || null,
            subscription: "free",
          },
        });
        return NextResponse.json(
          {
            message:
              "Account created! You can now sign in with your email and password.",
          },
          { status: 201 }
        );
      }

      // Full account exists → must sign in
      return NextResponse.json(
        { error: { email: ["An account with this email already exists. Please sign in."] } },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: name || null,
      },
    });

    // WBS 2.3 – Create verification token (email sending via Resend in production)
    const verifyToken = randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: verifyToken,
        expires: verifyExpires,
      },
    });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/verify-email?token=${verifyToken}`;

    const emailResult = await sendVerificationEmail(normalizedEmail, verifyLink);
    if (!emailResult.ok) {
      console.error("Verification email failed:", emailResult.error);
    }

    return NextResponse.json(
      {
        message: emailResult.ok
          ? "Account created. Check your email to verify before signing in."
          : "Account created. Please sign in. (Verification email could not be sent.)",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
