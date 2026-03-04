// Verify email change – update user email and clear pending
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(1, "Token required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid token", success: false }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        pendingEmailToken: parsed.data.token,
        pendingEmailTokenExpires: { gt: new Date() },
      },
    });

    if (!user || !user.pendingEmail) {
      return NextResponse.json(
        { error: "Invalid or expired verification link. Request a new one from settings.", success: false },
        { status: 400 }
      );
    }

    // Ensure new email isn't taken (race condition check)
    const existing = await prisma.user.findUnique({
      where: { email: user.pendingEmail },
    });
    if (existing && existing.id !== user.id) {
      return NextResponse.json(
        { error: "This email is already in use.", success: false },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        emailVerified: new Date(),
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailTokenExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email updated. Please sign in with your new email address.",
    });
  } catch (err) {
    console.error("Change email verify error:", err);
    return NextResponse.json({ error: "Something went wrong", success: false }, { status: 500 });
  }
}
