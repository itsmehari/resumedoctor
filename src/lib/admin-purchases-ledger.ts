import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PurchaseLedgerItem = {
  id: string;
  source: "invoice" | "superprofile";
  createdAt: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  planOrProduct: string;
  amountPaise: number | null;
  currency: string;
  status: string;
  externalRef: string | null;
  idempotencyKey: string | null;
  pdfUrl: string | null;
};

const invoiceStatuses = new Set(["paid", "pending", "refunded"]);

export type PurchaseLedgerQuery = {
  source: "all" | "invoice" | "superprofile";
  status?: string;
  plan?: string;
  q?: string;
  fromD?: Date;
  toD?: Date;
  skip: number;
  take: number;
};

export async function queryAdminPurchaseLedger(
  input: PurchaseLedgerQuery
): Promise<{ items: PurchaseLedgerItem[]; total: number }> {
  const { source, status: statusIn, plan, q = "", skip, take } = input;
  const fromD = input.fromD;
  const toD = input.toD;
  const status =
    statusIn && invoiceStatuses.has(statusIn) ? statusIn : undefined;

  if (source === "invoice") {
    const where: Prisma.InvoiceWhereInput = {
      ...(status ? { status } : {}),
      ...(plan ? { plan } : {}),
      ...(fromD || toD
        ? {
            createdAt: {
              ...(fromD ? { gte: fromD } : {}),
              ...(toD ? { lte: toD } : {}),
            },
          }
        : {}),
      ...(q
        ? {
            user: {
              OR: [
                { email: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        include: { user: { select: { email: true, name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);
    return {
      total,
      items: rows.map((r) => ({
        id: r.id,
        source: "invoice" as const,
        createdAt: r.createdAt.toISOString(),
        userId: r.userId,
        userEmail: r.user.email,
        userName: r.user.name,
        planOrProduct: r.plan,
        amountPaise: r.amount,
        currency: r.currency,
        status: r.status,
        externalRef: r.externalRef,
        idempotencyKey: null,
        pdfUrl: r.pdfUrl,
      })),
    };
  }

  if (source === "superprofile") {
    const where: Prisma.SuperprofilePurchaseEventWhereInput = {
      ...(plan ? { productKey: plan } : {}),
      ...(fromD || toD
        ? {
            createdAt: {
              ...(fromD ? { gte: fromD } : {}),
              ...(toD ? { lte: toD } : {}),
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              {
                user: {
                  OR: [
                    { email: { contains: q, mode: "insensitive" } },
                    { name: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      prisma.superprofilePurchaseEvent.count({ where }),
      prisma.superprofilePurchaseEvent.findMany({
        where,
        include: { user: { select: { email: true, name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);
    return {
      total,
      items: rows.map((r) => ({
        id: r.id,
        source: "superprofile" as const,
        createdAt: r.createdAt.toISOString(),
        userId: r.userId,
        userEmail: r.user.email,
        userName: r.user.name,
        planOrProduct: r.productKey,
        amountPaise: null,
        currency: "INR",
        status: "recorded",
        externalRef: null,
        idempotencyKey: r.idempotencyKey,
        pdfUrl: null,
      })),
    };
  }

  const invStatusSql =
    status != null ? Prisma.sql`AND i.status = ${status}` : Prisma.empty;
  const invPlanSql = plan != null ? Prisma.sql`AND i.plan = ${plan}` : Prisma.empty;
  const evtPlanSql = plan != null ? Prisma.sql`AND e."productKey" = ${plan}` : Prisma.empty;
  const evtHideWhenInvoiceStatus =
    status != null ? Prisma.sql`AND false` : Prisma.empty;
  const qPattern = q ? `%${q.replace(/%/g, "\\%").replace(/_/g, "\\_")}%` : null;
  const qSqlInv =
    qPattern != null
      ? Prisma.sql`AND (u.email ILIKE ${qPattern} OR COALESCE(u.name, '') ILIKE ${qPattern})`
      : Prisma.empty;
  const qSqlEvt =
    qPattern != null
      ? Prisma.sql`AND (e.email ILIKE ${qPattern} OR u2.email ILIKE ${qPattern} OR COALESCE(u2.name, '') ILIKE ${qPattern})`
      : Prisma.empty;
  const fromSql =
    fromD != null ? Prisma.sql`AND i."createdAt" >= ${fromD}` : Prisma.empty;
  const toSql = toD != null ? Prisma.sql`AND i."createdAt" <= ${toD}` : Prisma.empty;
  const fromSqlE =
    fromD != null ? Prisma.sql`AND e."createdAt" >= ${fromD}` : Prisma.empty;
  const toSqlE = toD != null ? Prisma.sql`AND e."createdAt" <= ${toD}` : Prisma.empty;

  const unionQuery = Prisma.sql`
    SELECT * FROM (
      SELECT
        i.id,
        'invoice'::text AS source,
        i."createdAt" AS "createdAt",
        i."userId" AS "userId",
        u.email AS "userEmail",
        u.name AS "userName",
        i.plan AS "planOrProduct",
        i.amount AS "amountPaise",
        i.currency AS currency,
        i.status AS status,
        i."externalRef" AS "externalRef",
        NULL::text AS "idempotencyKey",
        i."pdfUrl" AS "pdfUrl"
      FROM "Invoice" i
      INNER JOIN "User" u ON u.id = i."userId"
      WHERE 1=1 ${invStatusSql} ${invPlanSql} ${qSqlInv} ${fromSql} ${toSql}
      UNION ALL
      SELECT
        e.id,
        'superprofile'::text AS source,
        e."createdAt",
        e."userId",
        e.email AS "userEmail",
        u2.name AS "userName",
        e."productKey" AS "planOrProduct",
        NULL::int AS "amountPaise",
        'INR'::text AS currency,
        'recorded'::text AS status,
        NULL::text AS "externalRef",
        e."idempotencyKey" AS "idempotencyKey",
        NULL::text AS "pdfUrl"
      FROM "SuperprofilePurchaseEvent" e
      INNER JOIN "User" u2 ON u2.id = e."userId"
      WHERE 1=1 ${evtPlanSql} ${evtHideWhenInvoiceStatus} ${qSqlEvt} ${fromSqlE} ${toSqlE}
    ) combined
    ORDER BY "createdAt" DESC
    LIMIT ${take} OFFSET ${skip}
  `;

  const countQuery = Prisma.sql`
    SELECT COUNT(*)::bigint AS c FROM (
      SELECT i.id
      FROM "Invoice" i
      INNER JOIN "User" u ON u.id = i."userId"
      WHERE 1=1 ${invStatusSql} ${invPlanSql} ${qSqlInv} ${fromSql} ${toSql}
      UNION ALL
      SELECT e.id
      FROM "SuperprofilePurchaseEvent" e
      INNER JOIN "User" u2 ON u2.id = e."userId"
      WHERE 1=1 ${evtPlanSql} ${evtHideWhenInvoiceStatus} ${qSqlEvt} ${fromSqlE} ${toSqlE}
    ) x
  `;

  const [rows, countRows] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        id: string;
        source: string;
        createdAt: Date;
        userId: string;
        userEmail: string;
        userName: string | null;
        planOrProduct: string;
        amountPaise: number | null;
        currency: string;
        status: string;
        externalRef: string | null;
        idempotencyKey: string | null;
        pdfUrl: string | null;
      }>
    >(unionQuery),
    prisma.$queryRaw<Array<{ c: bigint }>>(countQuery),
  ]);

  const total = Number(countRows[0]?.c ?? 0);

  return {
    total,
    items: rows.map((r) => ({
      id: r.id,
      source: r.source as "invoice" | "superprofile",
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      userId: r.userId,
      userEmail: r.userEmail,
      userName: r.userName,
      planOrProduct: r.planOrProduct,
      amountPaise: r.amountPaise,
      currency: r.currency,
      status: r.status,
      externalRef: r.externalRef,
      idempotencyKey: r.idempotencyKey,
      pdfUrl: r.pdfUrl,
    })),
  };
}
