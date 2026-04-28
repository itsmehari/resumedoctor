-- Rename legacy "free" subscription state to "basic"
UPDATE "User"
SET "subscription" = 'basic'
WHERE "subscription" = 'free';

-- Ensure new records default to basic
ALTER TABLE "User"
ALTER COLUMN "subscription" SET DEFAULT 'basic';
