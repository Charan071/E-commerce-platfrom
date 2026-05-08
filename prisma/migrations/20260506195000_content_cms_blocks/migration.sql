-- CreateTable
CREATE TABLE "brand_kit" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL DEFAULT 'AnavaSilks',
    "tagline" TEXT NOT NULL DEFAULT 'Silk and Sarees',
    "voice" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#171717',
    "secondaryColor" TEXT NOT NULL DEFAULT '#f6f4f0',
    "accentColor" TEXT NOT NULL DEFAULT '#8b6a3e',
    "headingFont" TEXT NOT NULL DEFAULT 'Playfair Display',
    "bodyFont" TEXT NOT NULL DEFAULT 'Inter',
    "navLetterSpacing" TEXT NOT NULL DEFAULT '0.22em',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_kit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_hero" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "ctaLabel" TEXT DEFAULT 'Shop Here',
    "ctaHref" TEXT DEFAULT '/collections',
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_highlights" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "href" TEXT NOT NULL DEFAULT '/collections',
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nav_promo_blocks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "href" TEXT NOT NULL DEFAULT '/collections',
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nav_promo_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_hero_isActive_idx" ON "home_hero"("isActive");

-- CreateIndex
CREATE INDEX "collection_highlights_isActive_sortOrder_idx" ON "collection_highlights"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "nav_promo_blocks_isActive_sortOrder_idx" ON "nav_promo_blocks"("isActive", "sortOrder");

-- Enable RLS
ALTER TABLE "brand_kit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "home_hero" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collection_highlights" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "nav_promo_blocks" ENABLE ROW LEVEL SECURITY;
