# AnavaSilks Frontend

Next.js app for the AnavaSilks luxury silk saree storefront and admin console: catalog, cart, checkout, Supabase auth, Prisma on PostgreSQL, and Cloudinary-backed media.

## Documentation

- **[docs/spec.md](./docs/spec.md)** — canonical spec: routes, APIs, data model, environment variables, and current feature scope.
- [docs/system-design.md](./docs/system-design.md) — architecture, flows, and diagrams.
- [docs/content-model.md](./docs/content-model.md) — CMS entities and admin APIs.
- [docs/brand-kit.md](./docs/brand-kit.md) — brand tokens and UX rules.

## Prerequisites

- Node.js compatible with Next.js 16
- PostgreSQL `DATABASE_URL` (e.g. Supabase)
- Supabase project (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; service role where required)
- Optional: Cloudinary for admin uploads

## Scripts

```bash
npm install
npm run dev          # Next dev (webpack)
npm run dev:turbo    # Next dev (Turbopack)
npm run dev:fresh    # Clean .next then dev
npm run build
npm run start
npm run lint
npm run test         # Vitest
npm run seed         # Prisma seed (see prisma/seed.mjs)
```

## Agent / framework notes

See [AGENTS.md](./AGENTS.md) for Next.js version-specific guidance used in this repo.
