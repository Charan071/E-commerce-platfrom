-- AlterTable: add surfaceColor and mutedTextColor to brand_kit
ALTER TABLE "brand_kit"
ADD COLUMN "surfaceColor"   TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN "mutedTextColor" TEXT NOT NULL DEFAULT '#6b6b6b';
