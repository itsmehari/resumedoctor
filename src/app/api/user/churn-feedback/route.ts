// Optional churn / cancellation feedback (authenticated)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  reason: z.string().min(1).max(200),
  detail: z.string().max(2000).optional(),
  source: z.enum(["delete_account", "cancel_subscription"]).default("cancel_subscription"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await prisma.churnFeedback.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      reason: parsed.data.reason,
      detail: parsed.data.detail,
      source: parsed.data.source,
    },
  });

  return NextResponse.json({ ok: true });
}
