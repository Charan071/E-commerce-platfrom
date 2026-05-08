import { prisma } from "@/lib/prisma";
import {
  addCollectionHighlight,
  addNavPromo,
  deleteCollectionHighlight,
  deleteNavPromo,
  updateBrandKit,
  upsertHero,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [brandKit, hero, highlights, navPromos] = await Promise.all([
    prisma.brandKit.findFirst({ orderBy: { createdAt: "asc" } }).catch(() => null),
    prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } }).catch(() => null),
    prisma.collectionHighlight.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }).catch(() => []),
    prisma.navPromoBlock.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }).catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl text-gray-950">Brand Kit</h2>
        <p className="mt-1 text-sm text-gray-600">
          Core brand identity tokens used by storefront layout and navigation.
        </p>
        <form action={updateBrandKit} className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="brandName" defaultValue={brandKit?.brandName ?? "AnavaSilks"} placeholder="Brand name" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="tagline" defaultValue={brandKit?.tagline ?? "Silk and Sarees"} placeholder="Tagline" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />

          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Primary (text/actions)
            <input type="color" name="primaryColor" defaultValue={brandKit?.primaryColor ?? "#171717"} className="h-9 w-full cursor-pointer rounded-md border border-[#eadfd5] px-1 py-1" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Secondary (page background)
            <input type="color" name="secondaryColor" defaultValue={brandKit?.secondaryColor ?? "#f6f4f0"} className="h-9 w-full cursor-pointer rounded-md border border-[#eadfd5] px-1 py-1" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Accent (luxury highlight)
            <input type="color" name="accentColor" defaultValue={brandKit?.accentColor ?? "#8b6a3e"} className="h-9 w-full cursor-pointer rounded-md border border-[#eadfd5] px-1 py-1" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Surface (card / white background)
            <input type="color" name="surfaceColor" defaultValue={brandKit?.surfaceColor ?? "#ffffff"} className="h-9 w-full cursor-pointer rounded-md border border-[#eadfd5] px-1 py-1" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Muted text (secondary copy)
            <input type="color" name="mutedTextColor" defaultValue={brandKit?.mutedTextColor ?? "#6b6b6b"} className="h-9 w-full cursor-pointer rounded-md border border-[#eadfd5] px-1 py-1" />
          </label>
          <input name="navLetterSpacing" defaultValue={brandKit?.navLetterSpacing ?? "0.22em"} placeholder="Nav letter spacing e.g. 0.22em" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />

          <input name="headingFont" defaultValue={brandKit?.headingFont ?? "Playfair Display"} placeholder="Heading font (reference)" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="bodyFont" defaultValue={brandKit?.bodyFont ?? "Inter"} placeholder="Body font (reference)" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <p className="text-xs text-gray-400 md:col-span-2 -mt-2">Font fields are reference metadata — the active fonts (Playfair Display, Inter) are loaded statically and require a code deploy to change.</p>
          <textarea name="voice" defaultValue={brandKit?.voice ?? ""} placeholder="Brand voice" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2 min-h-20" />
          <div className="md:col-span-2">
            <button type="submit" className="rounded-md bg-[var(--admin-primary)] px-4 py-2 text-sm font-medium text-white">Save Brand Kit</button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl text-gray-950">Homepage Hero</h2>
        <form action={upsertHero} className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="title" defaultValue={hero?.title ?? "Whisper of Summer"} placeholder="Hero title" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <input name="subtitle" defaultValue={hero?.subtitle ?? ""} placeholder="Hero subtitle" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <input name="ctaLabel" defaultValue={hero?.ctaLabel ?? "Shop Here"} placeholder="CTA label" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="ctaHref" defaultValue={hero?.ctaHref ?? "/collections"} placeholder="/collections" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="imageUrl" defaultValue={hero?.imageUrl ?? "/images/hero.png"} placeholder="Cloudinary image URL" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <input name="imagePublicId" defaultValue={hero?.imagePublicId ?? ""} placeholder="Cloudinary public_id (optional)" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
            <input type="checkbox" name="isActive" defaultChecked={hero?.isActive ?? true} /> Active hero
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-md bg-[var(--admin-primary)] px-4 py-2 text-sm font-medium text-white">Save Hero</button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl text-gray-950">Collection Highlights</h2>
        <p className="mt-1 text-sm text-gray-600">Cards used on homepage featured collections.</p>
        <form action={addCollectionHighlight} className="mt-5 grid gap-3 md:grid-cols-2">
          <input name="title" placeholder="Title" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="subtitle" placeholder="Subtitle" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="href" placeholder="/collections" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="sortOrder" placeholder="Sort order" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="imageUrl" placeholder="Image URL" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <input name="imagePublicId" placeholder="Image public_id (optional)" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
            <input type="checkbox" name="imageHasEmbeddedText" />
            Image has embedded text (hide overlay copy on storefront)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
          <div className="md:col-span-2"><button type="submit" className="rounded-md bg-[var(--admin-primary)] px-4 py-2 text-sm font-medium text-white">Add Highlight</button></div>
        </form>
        <div className="mt-5 space-y-2">
          {highlights.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-[#eadfd5] p-3 text-sm">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500">
                  {item.subtitle} · {item.href} · #{item.sortOrder}
                  {item.imageHasEmbeddedText ? " · Embedded text: Yes" : " · Embedded text: No"}
                </p>
              </div>
              <form action={deleteCollectionHighlight.bind(null, item.id)}>
                <button type="submit" className="text-red-600">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-2xl text-gray-950">Navigation Promo Blocks</h2>
        <p className="mt-1 text-sm text-gray-600">Cards used in hover mega menu under Shop.</p>
        <form action={addNavPromo} className="mt-5 grid gap-3 md:grid-cols-2">
          <input name="title" placeholder="Title" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="subtitle" placeholder="Subtitle" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="href" placeholder="/collections" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="sortOrder" placeholder="Sort order" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm" />
          <input name="imageUrl" placeholder="Image URL" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <input name="imagePublicId" placeholder="Image public_id (optional)" className="rounded-md border border-[#eadfd5] px-3 py-2 text-sm md:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2">
            <input type="checkbox" name="imageHasEmbeddedText" />
            Image has embedded text (hide overlay copy on storefront)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 md:col-span-2"><input type="checkbox" name="isActive" defaultChecked /> Active</label>
          <div className="md:col-span-2"><button type="submit" className="rounded-md bg-[var(--admin-primary)] px-4 py-2 text-sm font-medium text-white">Add Nav Promo</button></div>
        </form>
        <div className="mt-5 space-y-2">
          {navPromos.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-[#eadfd5] p-3 text-sm">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500">
                  {item.subtitle} · {item.href} · #{item.sortOrder}
                  {item.imageHasEmbeddedText ? " · Embedded text: Yes" : " · Embedded text: No"}
                </p>
              </div>
              <form action={deleteNavPromo.bind(null, item.id)}>
                <button type="submit" className="text-red-600">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
