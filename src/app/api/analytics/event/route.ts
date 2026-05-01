// Authenticated first-party analytics mirror (writes ProductEvent)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordProductEvent } from "@/lib/product-events";
import { sessionUserEmail } from "@/lib/session-user";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  name: z.string().min(1).max(128),
  props: z
    .record(z.unknown())
    .optional()
    .refine(
      (rec) => {
        if (!rec) return true;
        if (Object.keys(rec).length > 40) return false;
        for (const v of Object.values(rec)) {
          if (v === null) continue;
          const t = typeof v;
          if (t === "boolean") continue;
          if (t === "number") {
            if (!Number.isFinite(v)) return false;
            continue;
          }
          if (t === "string") {
            if ((v as string).length > 500) return false;
            continue;
          }
          return false;
        }
        return true;
      },
      { message: "props must have at most 40 keys; values: string (max 500), finite number, boolean, or null" }
    ),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    select: { id: true },
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

  await recordProductEvent({
    userId: user.id,
    name: parsed.data.name,
    props: (parsed.data.props ?? null) as Record<string, unknown> | null,
  });

  return NextResponse.json({ ok: true });
}
