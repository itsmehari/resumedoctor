-- Pro Link (Phase 2B foundation + commercial layer)
-- Adds:
--   Resume.vanitySlug      — user-claimed memorable URL (e.g. /r/hari-krishnan)
--   Resume.viewCount       — anonymous, bot-filtered counter
--   Resume.lastViewedAt    — last visitor timestamp (display only)
--   User.proLinkActive     — cached entitlement flag (standalone SKU only; annual computed)
--   User.proLinkExpiresAt  — when the standalone Pro Link subscription lapses
--   User.proLinkSource     — diagnostic: "annual" | "standalone" | "complimentary"

ALTER TABLE "Resume" ADD COLUMN "vanitySlug" TEXT;
ALTER TABLE "Resume" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Resume" ADD COLUMN "lastViewedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Resume_vanitySlug_key" ON "Resume"("vanitySlug");

ALTER TABLE "User" ADD COLUMN "proLinkActive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "proLinkExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "proLinkSource" TEXT;
