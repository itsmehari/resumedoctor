import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type RecordProductEventInput = {
  userId?: string | null;
  name: string;
  props?: Record<string, unknown> | null;
};

/** Append-only product analytics; failures are swallowed so core flows never break. */
export async function recordProductEvent(input: RecordProductEventInput): Promise<void> {
  try {
    const props =
      input.props && Object.keys(input.props).length > 0
        ? (input.props as Prisma.InputJsonValue)
        : undefined;
    await prisma.productEvent.create({
      data: {
        userId: input.userId ?? undefined,
        name: input.name,
        props: props ?? undefined,
      },
    });
  } catch (err) {
    console.error("[product-events]", input.name, err);
  }
}
