// Admin – paginated purchase ledger (Invoice + SuperprofilePurchaseEvent)
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { queryAdminPurchaseLedger } from "@/lib/admin-purchases-ledger";

const PAGE_SIZE_DEFAULT = 25;
const PAGE_SIZE_MAX = 100;

function parseDate(s: string | null): Date | undefined {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(searchParams.get("pageSize") || String(PAGE_SIZE_DEFAULT), 10) || PAGE_SIZE_DEFAULT)
  );
  const skip = (page - 1) * pageSize;
  const source = (searchParams.get("source") || "all") as "all" | "invoice" | "superprofile";
  const statusParam = searchParams.get("status");
  const status =
    statusParam && ["paid", "pending", "refunded"].includes(statusParam)
      ? statusParam
      : undefined;
  const plan = searchParams.get("plan")?.trim() || undefined;
  const q = searchParams.get("q")?.trim() || "";
  const fromD = parseDate(searchParams.get("from"));
  const toD = parseDate(searchParams.get("to"));

  const { items, total } = await queryAdminPurchaseLedger({
    source,
    status,
    plan,
    q,
    fromD,
    toD,
    skip,
    take: pageSize,
  });

  return NextResponse.json({
    source,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
    items,
  });
}
