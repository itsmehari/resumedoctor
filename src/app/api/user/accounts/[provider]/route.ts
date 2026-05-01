// User – Unlink OAuth account
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionUserEmail } from "@/lib/session-user";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await getServerSession(authOptions);
  const sessionEmail = sessionUserEmail(session);
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { provider } = await params;
  const validProviders = ["google", "linkedin"];
  if (!validProviders.includes(provider.toLowerCase())) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionEmail },
    include: { accounts: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const accountToDelete = user.accounts.find(
    (a) => a.provider.toLowerCase() === provider.toLowerCase()
  );

  if (!accountToDelete) {
    return NextResponse.json({ error: "Account not linked" }, { status: 404 });
  }

  const remainingAccounts = user.accounts.filter((a) => a.id !== accountToDelete.id);
  const hasPassword = !!user.passwordHash;

  if (remainingAccounts.length === 0 && !hasPassword) {
    return NextResponse.json(
      { error: "Cannot unlink your only sign-in method. Set a password first." },
      { status: 400 }
    );
  }

  await prisma.account.delete({ where: { id: accountToDelete.id } });

  return NextResponse.json({ success: true });
}
