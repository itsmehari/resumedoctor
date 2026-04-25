// Authenticated first-party analytics mirror (writes ProductEvent)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordProductEvent } from "@/lib/product-events";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  name: z.string().min(1).max(128),
  props: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
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
    props: parsed.data.props,
  });

  return NextResponse.json({ ok: true });
}
