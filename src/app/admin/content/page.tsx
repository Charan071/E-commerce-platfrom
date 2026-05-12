import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  addCollectionHighlight,
  addHero,
  addNavPromo,
  deleteCollectionHighlight,
  deleteNavPromo,
  updateBrandKit,
} from "./actions";
import { EditableBannerList } from "@/components/admin/EditableBannerList";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-black transition";
const labelClass = "block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1";
const sectionClass = "rounded-lg border border-neutral-100 bg-white p-6 space-y-5";
const saveBtn = "inline-flex h-9 items-center px-4 rounded-md text-sm font-semibold text-white bg-black hover:bg-neutral-800 transition-colors";

export default async function AdminContentPage() {
  const [brandKit, banners, highlights, navPromos] = await Promise.all([
    prisma.brandKit.findFirst({ orderBy: { createdAt: "asc" } }).catch(() => null),
    prisma.homeHero.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []),
    prisma.collectionHighlight.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }).catch(() => []),
    prisma.navPromoBlock.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }).catch(() => []),
  ]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-semibold text-black">Store Content</h2>
        <p className="mt-1 text-sm text-neutral-500">Control what customers see on your storefront — no code needed.</p>
      </div>

      {/* ── 1. Store Identity ── */}
      <section className={sectionClass}>
        <div>
          <h3 className="font-semibold text-black">Store Identity</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Brand name, tagline, and colours shown across the site.</p>
        </div>

        <form action={updateBrandKit} className="space-y-4">
          <input type="hidden" name="voice" value={brandKit?.voice ?? ""} />
          <input type="hidden" name="headingFont" value={brandKit?.headingFont ?? "Playfair Display"} />
          <input type="hidden" name="bodyFont" value={brandKit?.bodyFont ?? "Inter"} />
          <input type="hidden" name="navLetterSpacing" value={brandKit?.navLetterSpacing ?? "0.22em"} />
          <input type="hidden" name="accentColor" value={brandKit?.accentColor ?? "#8b6a3e"} />
          <input type="hidden" name="surfaceColor" value={brandKit?.surfaceColor ?? "#ffffff"} />
          <input type="hidden" name="mutedTextColor" value={brandKit?.mutedTextColor ?? "#6b6b6b"} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Store name</label>
              <input name="brandName" defaultValue={brandKit?.brandName ?? "AnavaSilks"} placeholder="AnavaSilks" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input name="tagline" defaultValue={brandKit?.tagline ?? "Silk and Sarees"} placeholder="Silk and Sarees" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Primary colour <span className="normal-case font-normal text-neutral-400">(buttons, text, icons)</span></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="color" name="primaryColor" defaultValue={brandKit?.primaryColor ?? "#171717"} className="h-9 w-14 cursor-pointer rounded border border-neutral-200 p-1" />
                <span className="text-xs text-neutral-400">{brandKit?.primaryColor ?? "#171717"}</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Background colour <span className="normal-case font-normal text-neutral-400">(page background)</span></label>
              <div className="flex items-center gap-3 mt-1">
                <input type="color" name="secondaryColor" defaultValue={brandKit?.secondaryColor ?? "#f6f4f0"} className="h-9 w-14 cursor-pointer rounded border border-neutral-200 p-1" />
                <span className="text-xs text-neutral-400">{brandKit?.secondaryColor ?? "#f6f4f0"}</span>
              </div>
            </div>
          </div>

          <button type="submit" className={saveBtn}>Save identity</button>
        </form>
      </section>

      {/* ── 2. Homepage Banners ── */}
      <section className={sectionClass}>
        <div>
          <h3 className="font-semibold text-black">Homepage Banners</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Multiple banners rotate as a carousel. Active banners cycle every 5 seconds.</p>
        </div>

        <EditableBannerList banners={banners} />

        <form action={addHero} className="space-y-4 pt-4 border-t border-neutral-100">
          <p className={labelClass}>Add banner</p>
          <input type="hidden" name="imagePublicId" value="" />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Headline</label>
              <input name="title" placeholder="e.g. New Summer Collection" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subheading <span className="normal-case font-normal text-neutral-400">(optional)</span></label>
              <input name="subtitle" placeholder="A short description" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Button label</label>
              <input name="ctaLabel" placeholder="Shop Here" defaultValue="Shop Here" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Button link</label>
              <input name="ctaHref" placeholder="/shop" defaultValue="/shop" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Banner image URL</label>
            <input name="imageUrl" placeholder="https://res.cloudinary.com/…" className={inputClass} />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="isActive" id="newHeroActive" defaultChecked className="h-4 w-4 rounded border-neutral-300 accent-black" />
            <label htmlFor="newHeroActive" className="text-sm text-neutral-700 cursor-pointer">Make live immediately</label>
          </div>

          <button type="submit" className={saveBtn}>Add banner</button>
        </form>
      </section>

      {/* ── 3. Shop Menu Images ── */}
      <section className={sectionClass}>
        <div>
          <h3 className="font-semibold text-black">Shop Menu Images</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Up to 2 images shown when customers hover "Shop" in the navigation bar.</p>
        </div>

        {navPromos.length > 0 && (
          <div className="space-y-2">
            {navPromos.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-md border border-neutral-100 p-3">
                {item.imageUrl && (
                  <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded border border-neutral-100">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{item.title}</p>
                  <p className="text-xs text-neutral-400 truncate">{item.href}</p>
                </div>
                <form action={deleteNavPromo.bind(null, item.id)}>
                  <button type="submit" className="shrink-0 text-xs text-neutral-400 hover:text-red-500 transition-colors">Remove</button>
                </form>
              </div>
            ))}
          </div>
        )}

        {navPromos.length < 2 && (
          <form action={addNavPromo} className="space-y-3 pt-2 border-t border-neutral-100">
            <p className={labelClass}>Add image</p>
            <input type="hidden" name="imagePublicId" value="" />
            <input type="hidden" name="imageHasEmbeddedText" value="" />
            <input type="hidden" name="isActive" value="on" />
            <input type="hidden" name="sortOrder" value={String(navPromos.length)} />
            <input type="hidden" name="subtitle" value="" />

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Title</label>
                <input name="title" placeholder="e.g. New Arrivals" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <input name="href" placeholder="/shop" defaultValue="/shop" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input name="imageUrl" placeholder="https://res.cloudinary.com/…" className={inputClass} />
            </div>

            <button type="submit" className={saveBtn}>Add image</button>
          </form>
        )}

        {navPromos.length >= 2 && (
          <p className="text-xs text-neutral-400">You have 2 images — remove one to add another.</p>
        )}
      </section>

      {/* ── 4. Featured Collections ── */}
      <section className={sectionClass}>
        <div>
          <h3 className="font-semibold text-black">Featured Collections</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Highlight collections on your homepage. Add up to 4.</p>
        </div>

        {highlights.length > 0 && (
          <div className="space-y-2">
            {highlights.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-md border border-neutral-100 p-3">
                {item.imageUrl && (
                  <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded border border-neutral-100">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{item.title}</p>
                  <p className="text-xs text-neutral-400 truncate">{item.subtitle} · {item.href}</p>
                </div>
                <form action={deleteCollectionHighlight.bind(null, item.id)}>
                  <button type="submit" className="shrink-0 text-xs text-neutral-400 hover:text-red-500 transition-colors">Remove</button>
                </form>
              </div>
            ))}
          </div>
        )}

        {highlights.length < 4 && (
          <form action={addCollectionHighlight} className="space-y-3 pt-2 border-t border-neutral-100">
            <p className={labelClass}>Add collection</p>
            <input type="hidden" name="imagePublicId" value="" />
            <input type="hidden" name="imageHasEmbeddedText" value="" />
            <input type="hidden" name="isActive" value="on" />
            <input type="hidden" name="sortOrder" value={String(highlights.length)} />

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Collection name</label>
                <input name="title" placeholder="e.g. Kanchipuram Silk" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Tagline <span className="normal-case font-normal text-neutral-400">(optional)</span></label>
                <input name="subtitle" placeholder="e.g. Timeless elegance" className={inputClass} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Link</label>
                <input name="href" placeholder="/shop?category=Kanchipuram+Silk" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Image URL</label>
                <input name="imageUrl" placeholder="https://res.cloudinary.com/…" className={inputClass} />
              </div>
            </div>

            <button type="submit" className={saveBtn}>Add collection</button>
          </form>
        )}

        {highlights.length >= 4 && (
          <p className="text-xs text-neutral-400">You have 4 collections — remove one to add another.</p>
        )}
      </section>
    </div>
  );
}
