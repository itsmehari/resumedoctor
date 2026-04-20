-- SaaS lifecycle: ProductEvent, ChurnFeedback, billing & onboarding fields, Invoice.externalRef

ALTER TABLE "User" ADD COLUMN "billingProvider" TEXT;
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "onboardingChecklist" JSONB;
ALTER TABLE "User" ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "proTrialReminder3dSentAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "proTrialReminder1dSentAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

ALTER TABLE "Invoice" ADD COLUMN "externalRef" TEXT;
CREATE UNIQUE INDEX "Invoice_externalRef_key" ON "Invoice"("externalRef");

CREATE TABLE "ProductEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "props" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductEvent_name_createdAt_idx" ON "ProductEvent"("name", "createdAt");
CREATE INDEX "ProductEvent_userId_createdAt_idx" ON "ProductEvent"("userId", "createdAt");

ALTER TABLE "ProductEvent" ADD CONSTRAINT "ProductEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ChurnFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "reason" TEXT NOT NULL,
    "detail" TEXT,
    "source" TEXT NOT NULL DEFAULT 'delete_account',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChurnFeedback_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ChurnFeedback_createdAt_idx" ON "ChurnFeedback"("createdAt");
CREATE INDEX "ChurnFeedback_source_createdAt_idx" ON "ChurnFeedback"("source", "createdAt");
