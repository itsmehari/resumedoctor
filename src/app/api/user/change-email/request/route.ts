// Request email change – send verification to new email
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { sendEmailChangeVerification } from "@/lib/email";

const schema = z.object({
  newEmail: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, passwordHash: true },
  });
  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { error: "Email change requires a password. OAuth-only users cannot change email." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors.newEmail?.[0] ?? parsed.error.flatten().fieldErrors.password?.[0] ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { newEmail, password } = parsed.data;

    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json({ error: "New email is the same as current email" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json({ error: "This email is already in use" }, { status: 400 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        pendingEmail: newEmail.toLowerCase(),
        pendingEmailToken: token,
        pendingEmailTokenExpires: expires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/settings/change-email/verify?token=${token}`;

    const result = await sendEmailChangeVerification(newEmail, verifyLink, user.email);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Verification email sent to your new address. Check your inbox.",
    });
  } catch (err) {
    console.error("Change email request error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
