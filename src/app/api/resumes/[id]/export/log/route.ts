// WBS 5.7, 10.7, 11.5 – Log export for client-side PDF (also consumes pack credit if applicable)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getResumeAuth } from "@/lib/trial-auth";
import { getResumeForExport, consumePackCreditIfNeeded, logExport } from "@/lib/export-api-helpers";
import { recordFeatureUsage } from "@/lib/feature-usage";

const schema = z.object({
  format: z.enum(["pdf"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getResumeAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await getResumeForExport(id, { requirePro: true });
  if ("error" in result) return result.error;

  const { userId } = result;
  await logExport(userId, id, "pdf");
  await consumePackCreditIfNeeded(userId);
  await recordFeatureUsage(userId, "export", { format: "pdf" });

  return NextResponse.json({ success: true });
}
