// Admin – Export reports (CSV); requires super admin when SUPER_ADMIN_EMAILS is set
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { queryAdminPurchaseLedger } from "@/lib/admin-purchases-ledger";

const PURCHASES_EXPORT_MAX = 10_000;

function csvEscape(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function parseDate(s: string | null): Date | undefined {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function GET(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "users";

  const allowed =
    type === "users" ||
    type === "exports" ||
    type === "purchases" ||
    type === "audit_log" ||
    type === "churn";
  if (!allowed) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  await logAdminAction({
    action: "admin_export_csv",
    adminUserId: admin.id,
    meta: { exportType: type },
  });

  if (type === "users") {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        subscription: true,
        createdAt: true,
      },
    });
    const headers = ["id", "email", "name", "subscription", "createdAt"];
    const csv = [
      headers.join(","),
      ...users.map((u) =>
        headers
          .map((h) => {
            const v = (u as Record<string, unknown>)[h];
            const s = String(v ?? "");
            return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      ),
    ].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=users-export.csv",
      },
    });
  }

  if (type === "exports") {
    const logs = await prisma.exportLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true } },
        resume: { select: { title: true } },
      },
      take: 5000,
    });
    const headers = ["id", "userId", "resumeId", "format", "userEmail", "resumeTitle", "createdAt"];
    const csv = [
      headers.join(","),
      ...logs.map((l) =>
        [
          l.id,
          l.userId,
          l.resumeId,
          l.format,
          (l.user as { email?: string })?.email ?? "",
          (l.resume as { title?: string })?.title ?? "",
          l.createdAt.toISOString(),
        ]
          .map((s) => (String(s).includes(",") || String(s).includes('"') ? `"${String(s).replace(/"/g, '""')}"` : s))
          .join(",")
      ),
    ].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=exports-log.csv",
      },
    });
  }

  if (type === "purchases") {
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

    const { items } = await queryAdminPurchaseLedger({
      source,
      status,
      plan,
      q,
      fromD,
      toD,
      skip: 0,
      take: PURCHASES_EXPORT_MAX,
    });

    const headers = [
      "source",
      "id",
      "createdAt",
      "userId",
      "userEmail",
      "userName",
      "planOrProduct",
      "amountPaise",
      "currency",
      "status",
      "externalRef",
      "idempotencyKey",
      "pdfUrl",
    ];
    const lines = [
      headers.join(","),
      ...items.map((row) =>
        [
          row.source,
          row.id,
          row.createdAt,
          row.userId,
          row.userEmail,
          row.userName ?? "",
          row.planOrProduct,
          row.amountPaise ?? "",
          row.currency,
          row.status,
          row.externalRef ?? "",
          row.idempotencyKey ?? "",
          row.pdfUrl ?? "",
        ].map((v) => csvEscape(String(v))).join(",")
      ),
    ];
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=purchases-export.csv",
      },
    });
  }

  if (type === "audit_log") {
    const rows = await prisma.securityAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10_000,
    });
    const headers = ["id", "createdAt", "action", "userId", "ip", "success", "meta"];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.id,
          r.createdAt.toISOString(),
          r.action,
          r.userId ?? "",
          r.ip ?? "",
          String(r.success),
          r.meta != null ? JSON.stringify(r.meta) : "",
        ].map((v) => csvEscape(String(v))).join(",")
      ),
    ];
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=security-audit-log.csv",
      },
    });
  }

  if (type === "churn") {
    const rows = await prisma.churnFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 10_000,
    });
    const headers = ["id", "createdAt", "userId", "userEmail", "reason", "detail", "source"];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.id,
          r.createdAt.toISOString(),
          r.userId ?? "",
          r.userEmail ?? "",
          r.reason,
          r.detail ?? "",
          r.source,
        ].map((v) => csvEscape(String(v))).join(",")
      ),
    ];
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=churn-feedback.csv",
      },
    });
  }

  return NextResponse.json({ error: "Export failed" }, { status: 500 });
}
