-- AlterTable
ALTER TABLE "collection_highlights"
ADD COLUMN "imageHasEmbeddedText" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "nav_promo_blocks"
ADD COLUMN "imageHasEmbeddedText" BOOLEAN NOT NULL DEFAULT false;
