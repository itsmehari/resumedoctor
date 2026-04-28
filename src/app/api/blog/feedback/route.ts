import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  slug: z.string().min(1).max(200),
  helpful: z.boolean(),
  comment: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[blog/feedback]", parsed.data);
  }
  return new NextResponse(null, { status: 204 });
}
