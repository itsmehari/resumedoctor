// Admin API – require admin role
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin(): Promise<{ id: string; email: string } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return null;
  return {
    id: (session.user as { id?: string }).id ?? "",
    email: session.user.email,
  };
}
