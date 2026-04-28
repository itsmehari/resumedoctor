// Admin – User list with pagination, search, filter
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10))
  );
  const search = searchParams.get("search")?.trim() ?? "";
  const subscription = searchParams.get("subscription")?.trim() ?? "";
  const roleFilter = searchParams.get("role")?.trim() ?? "";

  const skip = (page - 1) * limit;

  const where: {
    OR?: Array<{ email?: { contains: string; mode: "insensitive" }; name?: { contains: string; mode: "insensitive" } }>;
    subscription?: string | { in: string[] };
    role?: string;
  } = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }
  if (subscription) {
    where.subscription = subscription === "basic" ? { in: ["basic", "free"] } : subscription;
  }
  if (roleFilter) where.role = roleFilter;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        subscription: true,
        createdAt: true,
        _count: {
          select: { resumes: true, exportLogs: true, accounts: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
