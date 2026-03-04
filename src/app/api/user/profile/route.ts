// WBS 2.2, 11.8 – User profile API (supports trial, impersonation)
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrialFromRequest } from "@/lib/trial-auth";
import { getEffectiveAuth } from "@/lib/effective-auth";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.union([z.string().url(), z.string().length(0)]).optional().nullable(),
  notificationPrefs: z
    .object({
      marketing: z.boolean().optional(),
      productUpdates: z.boolean().optional(),
    })
    .optional(),
});

export async function GET() {
  const auth = await getEffectiveAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      emailVerified: true,
      subscription: true,
      subscriptionExpiresAt: true,
      notificationPrefs: true,
      twoFactorEnabled: true,
      createdAt: true,
      resumePackCredits: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isProTrial14Active =
    user.subscription === "pro_trial_14" &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date();

  return NextResponse.json({
    ...user,
    isTrial: user.subscription === "trial",
    isPro: ["pro_monthly", "pro_annual"].includes(user.subscription) || isProTrial14Active,
    isImpersonating: auth.isImpersonating ?? false,
    resumePackCredits: user.resumePackCredits ?? 0,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.image !== undefined) data.image = parsed.data.image === "" ? null : parsed.data.image;
    if (parsed.data.notificationPrefs !== undefined) data.notificationPrefs = parsed.data.notificationPrefs ?? undefined;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        subscription: true,
        notificationPrefs: true,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
