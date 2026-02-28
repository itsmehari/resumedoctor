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

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: { email: ["An account with this email already exists"] } },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
    });

    // WBS 2.3 – Create verification token (email sending via Resend in production)
    const verifyToken = randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verifyToken,
        expires: verifyExpires,
      },
    });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/verify-email?token=${verifyToken}`;

    const emailResult = await sendVerificationEmail(email, verifyLink);
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
