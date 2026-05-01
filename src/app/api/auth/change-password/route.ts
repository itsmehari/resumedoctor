// User – Change password (requires current password)
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { compare, hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "Account uses social login. Set a password first via Forgot password." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const err = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: err.newPassword?.[0] || err.currentPassword?.[0] || "Invalid input" },
        { status: 400 }
      );
    }

    const valid = await compare(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(parsed.data.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
