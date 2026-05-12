# AnavaSilks — Application Specification

**Repository:** `anavasilks-frontend`  
**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Prisma 7 + `@prisma/adapter-pg`, Supabase Auth, PostgreSQL, Cloudinary.  
**Companion docs:** [Brand kit](./brand-kit.md) · [Content model](./content-model.md) · [System design](./system-design.md)

This document is the canonical inventory of behavior, routes, data, and integrations as implemented in this codebase. When product intent and code diverge, treat this spec as describing the **current build**.

---

## 1. Product summary

AnavaSilks is a luxury silk saree e-commerce storefront with:

- Server-rendered marketing and catalog pages, client islands for interactivity (cart, checkout steps, hero carousel, wishlist toggles).
- Supabase-backed authentication (email/password, recovery) with Prisma `User` rows kept in sync after sign-in.
- Admin console under `/admin/*` for orders, inventory, categories, customers, reviews, CMS-style content (brand kit, hero slides, collection highlights, nav promos), newsletter subscribers, and informational settings pages.
- Checkout that persists orders via `POST /api/orders` with server-side price validation against the database.

---

## 2. Repository layout (high signal)

| Area | Role |
| --- | --- |
| `src/app/` | App Router pages, layouts, `route.ts` handlers, server actions |
| `src/components/` | Shared UI: layout shell, admin chrome, home sections, product UI |
| `src/lib/` | Auth, Prisma, catalog/content readers, cart context, Cloudinary, validation helpers |
| `prisma/` | `schema.prisma`, SQL migrations, seed script (`prisma/seed.mjs` via `npm run seed`) |
| `scripts/clean-next.mjs` | Next cache clean (`npm run clean`) |
| `docs/` | This spec and architecture/brand/content documentation |

---

## 3. Environment variables

| Variable | Required for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Prisma / Postgres | If missing, `prisma` export throws on access |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, middleware | Middleware logs and continues if missing (no redirect behavior) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Supabase client | Used from `src/lib/supabase/server.ts` where service role is needed |
| `NEXT_PUBLIC_SITE_URL` | Auth redirects, metadata, sitemap | Fallback: `VERCEL_URL` in `getSiteUrl()` |
| `ADMIN_REQUIRE_MFA` | Admin access | When `"true"`, `requireAdmin()` fails without MFA evidence in JWT claims |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | `POST /api/upload`, `uploadImage` | Admin-only uploads |

---

## 4. Storefront routes

| Path | Description |
| --- | --- |
| `/` | Home: `HeroCarousel` (from active `HomeHero` rows), collection highlights, product rail, newsletter block |
| `/shop` | Shop listing with filters (client: `ShopClient`) |
| `/product/[id]` | Product detail; `id` resolves by product UUID or slug |
| `/collections`, `/new-arrivals`, `/about` | Marketing / listing style pages |
| `/cart` | Cart view backed by `CartProvider` / `localStorage` |
| `/checkout` | Multi-step checkout; submits to `POST /api/orders` |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth flows (server actions in `src/app/auth/actions.ts`) |
| `/auth/callback`, `/auth/error` | OAuth/recovery callback handling |
| `/account`, `/account/addresses`, `/account/orders`, `/account/wishlist` | Signed-in customer area (layout + server data) |

**Global shell:** `RootLayout` loads brand kit and nav promos, injects CSS variables on `<html>`, wraps children in `SiteChrome` (navbar, footer, newsletter).

---

## 5. Admin routes

**Guard:** `src/app/admin/layout.tsx` calls `requireAdmin()`; failure redirects to `/?admin=forbidden`. Middleware additionally requires a Supabase session for any `/admin` path (or `admin.*` host) and redirects unauthenticated users to `/login?redirectTo=…`.

**Primary sidebar navigation** (`AdminSidebar`): Dashboard, Orders, Inventory, Categories, Customers, Reviews; Marketing: Content Studio, Newsletter; Store: Payments, General.

**Also implemented (direct URL or header titles):** `/admin/banners` and `/admin/coupons` are **guidance pages** (redirect messaging to Content Studio and product pricing, respectively—not separate DB entities). `/admin/settings/shipping` and `/admin/settings/taxes` exist as informational placeholders; they are not linked from the main sidebar.

---

## 6. HTTP API (`src/app/api`)

| Method & path | Auth | Purpose |
| --- | --- | --- |
| `GET` `/api/products` | Public | Paginated/filtered active products JSON; falls back to sample payload on expected DB errors |
| `POST` `/api/products` | Admin | Create product (JSON body with images/colors nested creates) |
| `GET` `/api/products/[id]` | Public | Single product JSON |
| `GET` `/api/categories` | Public | List categories with product counts; sample fallback on expected DB errors |
| `POST` `/api/categories` | Admin | Create category |
| `POST` `/api/orders` | Creates order from cart payload; validates totals against DB | Core checkout persistence |
| `GET` `/api/orders/[id]` | Order fetch rules as coded | |
| `GET/POST/DELETE` `/api/wishlist` | Session required | Prisma `WishlistItem` CRUD |
| `POST` `/api/upload` | `requireAdmin()` | Cloudinary image upload |
| `GET/PUT` `/api/admin/content/brand-kit` | Admin | Brand kit REST mirror of server actions |
| `GET/PUT` `/api/admin/content/hero` | Admin | Hero REST |
| `GET/POST` `/api/admin/content/blocks` | Admin | Collection or nav blocks (`?kind=`) |
| `PUT/DELETE` `/api/admin/content/blocks/[id]` | Admin | Block mutations |

---

## 7. Data model (Prisma)

Implemented models (PostgreSQL, snake_case table maps where `@map` is used):

- **Identity:** `User` (`CUSTOMER` \| `ADMIN`), `Address`
- **Catalog:** `Category`, `Product` (includes `sizes: String[]`, pricing, `isActive`, etc.), `ProductImage`, `ProductColor`
- **Commerce:** `Order`, `OrderItem` (snapshots line title/image/price), enums `OrderStatus`, `PaymentStatus`
- **Engagement:** `Review` (one per user per product), `WishlistItem`
- **CMS:** `BrandKit`, `HomeHero`, `CollectionHighlight`, `NavPromoBlock`
- **Ops:** `AdminAuditLog`, `NewsletterSubscription`

There is **no** `Coupon` or `Banner` table; coupons/banners admin pages explain the intended future wiring.

---

## 8. Authentication and authorization

- **Supabase** session cookies; `createServerClient` in middleware refreshes session on edge.
- **`getAuthContext()`** (`src/lib/auth.ts`): reads JWT claims; admin detection from `app_metadata.role` / `roles`; MFA detection from `aal` / `amr`.
- **`requireAdmin()`**: must be admin via JWT **or** `User.role === ADMIN` in Prisma; optional MFA gate via `ADMIN_REQUIRE_MFA`.
- **`ensureAppUser()`** (`src/lib/user-sync.ts`): upserts Prisma `User` by Supabase `id` after auth events.
- **Middleware** (`src/middleware.ts`): session refresh; `/admin` requires authenticated user (role **not** checked at edge—server layout enforces admin); logged-in users hitting login/signup/forgot-password/auth paths redirect to `/`; hostname `admin.*` root redirects to `/admin`.

---

## 9. Content and theming

- **Brand kit** row drives CSS variables on `<html>` (see brand kit doc). Fonts **Playfair Display** and **Inter** are loaded with `next/font`; DB fields are metadata.
- **Hero:** all **active** `HomeHero` rows, ordered by `createdAt` ascending, become **carousel slides** (`getHeroSlides()` + `HeroCarousel`).
- **Collection highlights:** active rows, sorted by `sortOrder` then `createdAt`; overlay copy hidden when `imageHasEmbeddedText` is true.
- **Nav promos:** same pattern for mega menu cards; if DB empty, code supplies deterministic fallback media blocks (may reference legacy public paths—ensure assets exist or CMS is populated in production).

Content mutations from admin use server actions and/or REST handlers with `requireAdmin()` and audit logging where implemented.

---

## 10. Catalog and fallbacks

- **`src/lib/catalog.ts`** reads active products from Prisma; maps decimals and images to the shared `Product` view type (`src/lib/mock-data.ts` shapes and constants for filters).
- On expected DB errors (e.g. uninitialized schema), **empty arrays or null** are returned rather than crashing; some UI paths still expect placeholder images for empty states.

---

## 11. Cart and checkout

- **Cart state:** React context + `localStorage` hydration (`src/lib/cart-context.tsx`).
- **Checkout:** client-side steps; submission builds an order request consumed by `POST /api/orders` (merges duplicate line items, validates products and amounts). Optional “save address” flows to authenticated user’s addresses when implemented in that handler path.

---

## 12. Security headers and SEO

- **`next.config.ts`:** security headers on all routes (`X-Frame-Options`, `Referrer-Policy`, etc.); `images.remotePatterns` for `images.unsplash.com` and `res.cloudinary.com`.
- **`src/app/robots.ts`:** allows `/`, disallows `/admin` and `/api/`.
- **`src/app/sitemap.ts`:** emits `/` and `/shop` when `getSiteUrl()` resolves.

---

## 13. Testing and tooling

- **Vitest** (`npm run test`): unit tests under `src/lib` (e.g. `email-validation.test.ts`, `shop-query.test.ts`).
- **ESLint** (`npm run lint`), **Next build** (`npm run build`).
- **Dev:** `npm run dev` (webpack); `npm run dev:turbo` for Turbopack; `npm run dev:fresh` cleans then dev.

---

## 14. Known gaps (engineering backlog)

Aligned with `system-design.md` and in-code placeholders:

- Cart-level coupons (no model or checkout validation).
- Dynamic shipping/tax rules (checkout uses client-side shipping estimate; settings pages are narrative only).
- Rich inline media editors on product edit (partially addressed via upload API—full UX may vary).
- Optional: `unstable_cache` / tag revalidation for hot read paths.
- Sidebar does not list every admin sub-route; discoverability could be improved.

---

## 15. Document maintenance

When adding routes, models, or env vars:

1. Update this **`spec.md`** first (inventory and tables).
2. Adjust **`system-design.md`** for architecture narrative and diagrams.
3. Adjust **`content-model.md`** for CMS field-level detail.
4. Adjust **`brand-kit.md`** only when brand or token semantics change.
