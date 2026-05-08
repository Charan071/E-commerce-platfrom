# AnavaSilks Brand Kit v2

## Brand Position

- Niche: luxury Indian silk sarees.
- Brand promise: heritage weaving + modern elegance.
- Voice: calm, refined, editorial, never loud.

## Visual Direction

- Inspiration baseline: editorial luxury storefront pattern from [Jayanti Reddy](https://jayantireddy.com/), adapted to silk-saree-first merchandising.
- Keep the layout airy, product-first, and image-led.
- Avoid dark-heavy admin-like reds on storefront surfaces.

## Color Tokens

All five color tokens are admin-managed via Content Studio and injected as CSS custom properties at runtime.

| Token      | CSS Variable          | DB Field         | Default   | Usage                       |
| ---------- | --------------------- | ---------------- | --------- | --------------------------- |
| Primary    | `--color-text`        | `primaryColor`   | `#171717` | Main text, actions, buttons |
| Secondary  | `--color-background`  | `secondaryColor` | `#f6f4f0` | Page background             |
| Accent     | `--color-accent`      | `accentColor`    | `#8b6a3e` | Luxury highlight, badges    |
| Surface    | `--color-surface`     | `surfaceColor`   | `#ffffff` | Card backgrounds, overlays  |
| Muted text | `--color-text-muted`  | `mutedTextColor` | `#6b6b6b` | Secondary copy, labels      |

## Typography

- Display / headings: `Playfair Display` (statically loaded via Next.js font)
- Body / UI text: `Inter` (statically loaded via Next.js font)
- Header nav tracking: `--nav-letter-spacing` CSS var, default `0.22em` — admin-manageable
- Font name fields in brand kit are reference metadata; changing them requires a code deploy
- Avoid bold-heavy blocks; prefer medium/light for luxury tone.

## CSS Variable Architecture

Brand kit tokens are injected as inline CSS custom properties on the `<html>` element in `src/app/layout.tsx`. The `globals.css` `@theme` block holds static fallback defaults used before hydration and by Tailwind utility generation.

Runtime injection variables:

- `--color-text` — primaryColor
- `--color-background` — secondaryColor
- `--color-accent` — accentColor
- `--color-surface` — surfaceColor
- `--color-text-muted` — mutedTextColor
- `--nav-letter-spacing` — navLetterSpacing
- `--brand-heading-font` — headingFont (metadata reference)
- `--brand-body-font` — bodyFont (metadata reference)

## Motion

- Hover zoom on cards/images: `1.03 - 1.05`, `500-700ms`, ease-out.
- Menu/overlay motion: subtle fade/slide, no bouncy motion.
- Keep transitions quiet and intentional.

## Content Hierarchy Rules

- Hero: one clear collection story + single CTA.
- Featured collections: 3 visual highlights max above fold.
- Product cards: image, title, price; minimal chrome.
- Footer: policies + company + contact + insider signup.

## Navigation Rules

- Desktop header: left nav, centered logo, right utility icons.
- `SHOP` hover mega menu must be content-managed (links + promo cards).
- Mobile menu should be nested and content-managed.

## Admin Ownership Matrix

- **Admin-managed**
  - Brand kit tokens (name/tagline/colors/spacing)
  - Home hero
  - Collection highlights
  - Shop mega menu promo cards
- **Catalog-owned**
  - Products, categories, inventory, orders

## Do / Don't

- Do prioritize saree drape, zari detail, texture closeups.
- Do keep whitespace and rhythm consistent.
- Do maintain auth/admin stability while evolving UI.
- Don't hardcode homepage/nav media in components once CMS data exists.
- Don't mix multiple visual languages in one screen.
- Don't hardcode color values in components — use CSS vars.
- Don't hardcode nav letter-spacing — use `var(--nav-letter-spacing)`.
