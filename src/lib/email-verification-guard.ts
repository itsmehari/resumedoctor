import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** For sensitive APIs: full account users must have verified email (trial/OAuth usually already verified). */
export async function requireVerifiedEmailOr403(
  email: string
): Promise<NextResponse | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });
  if (!user?.emailVerified) {
    return NextResponse.json(
      {
        error:
          "Verify your email to use this action. Open the link we sent when you signed up, or use “Resend verification” on the dashboard.",
        code: "EMAIL_NOT_VERIFIED",
      },
      { status: 403 }
    );
  }
  return null;
}
