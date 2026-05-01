import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type LogAdminActionInput = {
  action: string;
  adminUserId: string;
  targetUserId?: string | null;
  meta?: Record<string, unknown>;
  success?: boolean;
};

/** Best-effort audit trail for master admin operations. */
export async function logAdminAction(input: LogAdminActionInput): Promise<void> {
  try {
    const meta: Prisma.InputJsonValue | undefined =
      input.meta && Object.keys(input.meta).length > 0
        ? (input.meta as Prisma.InputJsonValue)
        : undefined;
    await prisma.securityAuditLog.create({
      data: {
        action: input.action,
        userId: input.targetUserId ?? null,
        meta: meta
          ? ({
              ...(meta as object),
              adminUserId: input.adminUserId,
            } as Prisma.InputJsonValue)
          : ({ adminUserId: input.adminUserId } as Prisma.InputJsonValue),
        success: input.success ?? true,
      },
    });
  } catch (err) {
    console.error("[admin-audit]", input.action, err);
  }
}
