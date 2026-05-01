// WBS 2.2, 11.8 – User profile API (supports trial, impersonation)
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTrialFromRequest } from "@/lib/trial-auth";
import { getEffectiveAuth } from "@/lib/effective-auth";
import { getMergedOnboardingForUser, type OnboardingStepKey } from "@/lib/onboarding";
import { recordProductEvent } from "@/lib/product-events";
import { AnalyticsEvents } from "@/lib/analytics-event-names";
import { sessionUserEmail } from "@/lib/session-user";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.union([z.string().url(), z.string().length(0)]).optional().nullable(),
  notificationPrefs: z
    .object({
      marketing: z.boolean().optional(),
      productUpdates: z.boolean().optional(),
    })
    .optional(),
  onboardingChecklist: z
    .object({
      template_chosen: z.boolean().optional(),
      section_filled: z.boolean().optional(),
      ats_run: z.boolean().optional(),
      export_done: z.boolean().optional(),
      hideGettingStarted: z.boolean().optional(),
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
  const normalizedSubscription = user.subscription === "free" ? "basic" : user.subscription;

  return NextResponse.json({
    ...user,
    subscription: normalizedSubscription,
    isTrial: user.subscription === "trial",
    isPro: ["pro_monthly", "pro_annual"].includes(user.subscription) || isProTrial14Active,
    isImpersonating: auth.isImpersonating ?? false,
    resumePackCredits: user.resumePackCredits ?? 0,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
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

    const existingUser = await prisma.user.findUnique({
      where: { email: sessionEmail },
      select: { id: true, onboardingChecklist: true },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const before = await getMergedOnboardingForUser(existingUser.id);

    const data: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.image !== undefined) data.image = parsed.data.image === "" ? null : parsed.data.image;
    if (parsed.data.notificationPrefs !== undefined) data.notificationPrefs = parsed.data.notificationPrefs ?? undefined;

    if (parsed.data.onboardingChecklist) {
      const prev = (existingUser.onboardingChecklist ?? {}) as Record<string, unknown>;
      const mergedManual = { ...prev, ...parsed.data.onboardingChecklist };
      data.onboardingChecklist = mergedManual;
    }

    const user = await prisma.user.update({
      where: { email: sessionEmail },
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

    if (parsed.data.onboardingChecklist) {
      const after = await getMergedOnboardingForUser(existingUser.id);
      const keys: OnboardingStepKey[] = [
        "template_chosen",
        "section_filled",
        "ats_run",
        "export_done",
      ];
      for (const key of keys) {
        if (after.steps[key] && !before.steps[key]) {
          await recordProductEvent({
            userId: existingUser.id,
            name: AnalyticsEvents.onboarding_step_completed,
            props: { step_name: key },
          });
        }
      }
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
