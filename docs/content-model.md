# Content Model (Admin-managed Storefront Blocks)

This model makes homepage and nav media blocks editable from admin instead of being hardcoded.

## 1) `BrandKit` (`brand_kit`)

Purpose: single source of truth for storefront brand identity.

Fields:

- `brandName`, `tagline`, `voice`
- `primaryColor`, `secondaryColor`, `accentColor`, `surfaceColor`, `mutedTextColor`
- `headingFont`, `bodyFont` (reference metadata — fonts are statically loaded)
- `navLetterSpacing`

UI usage:

- Header logo name
- CSS custom property injection on `<html>` — drives all site colors and nav spacing

## 2) `HomeHero` (`home_hero`)

Purpose: homepage hero copy + CTA + media.

Fields:

- `title`, `subtitle`
- `ctaLabel`, `ctaHref`
- `imageUrl`, `imagePublicId`
- `isActive`

UI usage:

- Top hero section on `/`

## 3) `CollectionHighlight` (`collection_highlights`)

Purpose: featured collection cards on homepage.

Fields:

- `title`, `subtitle`, `href`
- `imageUrl`, `imagePublicId`
- `imageHasEmbeddedText` — when `true`, storefront hides the overlay title/subtitle to avoid duplication with text baked into the image asset
- `sortOrder`, `isActive`

UI usage:

- Featured collection card grid on `/`

## 4) `NavPromoBlock` (`nav_promo_blocks`)

Purpose: promo cards in desktop `SHOP` mega menu.

Fields:

- `title`, `subtitle`, `href`
- `imageUrl`, `imagePublicId`
- `imageHasEmbeddedText` — same embedded-text semantics as CollectionHighlight
- `sortOrder`, `isActive`

UI usage:

- Right side visual cards in hover mega menu

## Admin APIs

- `GET/PUT /api/admin/content/brand-kit`
- `GET/PUT /api/admin/content/hero`
- `GET/POST /api/admin/content/blocks?kind=collection|nav`
- `PUT/DELETE /api/admin/content/blocks/:id?kind=collection|nav`

## Admin Screen

Route: `/admin/content`

Sections:

- Brand Kit editor (color pickers for all 5 color tokens, nav letter-spacing, font metadata)
- Hero editor
- Collection Highlights (create/list/delete)
- Nav Promo Blocks (create/list/delete)

## Frontend Consumption

- `getBrandKitContent()` used in root layout — result injected as CSS vars on `<html>`.
- `getHeroContent()` and `getCollectionHighlights()` used on homepage.
- `getNavPromoBlocks()` used in navbar mega menu.
- All readers include safe fallback content if tables are missing/unseeded.
- Brand kit update triggers `revalidatePath` for `/`, `/shop`, and `/admin/content`.
