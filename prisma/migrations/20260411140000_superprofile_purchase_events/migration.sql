-- SuperProfile webhook idempotency for purchase fulfillment

CREATE TABLE "SuperprofilePurchaseEvent" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "productKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payloadSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuperprofilePurchaseEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SuperprofilePurchaseEvent_idempotencyKey_key" ON "SuperprofilePurchaseEvent"("idempotencyKey");
CREATE INDEX "SuperprofilePurchaseEvent_email_idx" ON "SuperprofilePurchaseEvent"("email");
CREATE INDEX "SuperprofilePurchaseEvent_createdAt_idx" ON "SuperprofilePurchaseEvent"("createdAt");

ALTER TABLE "SuperprofilePurchaseEvent" ADD CONSTRAINT "SuperprofilePurchaseEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
