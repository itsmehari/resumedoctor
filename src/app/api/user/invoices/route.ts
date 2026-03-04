// User's invoice history
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const items = invoices.map((i) => ({
    id: i.id,
    amount: i.amount / 100, // paise to rupees
    currency: i.currency,
    plan: i.plan,
    status: i.status,
    pdfUrl: i.pdfUrl,
    createdAt: i.createdAt,
  }));

  return NextResponse.json({ invoices: items });
}
