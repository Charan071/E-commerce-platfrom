"use client";

import Image from "next/image";
import { useState } from "react";
import { deleteHero, updateHero } from "@/app/admin/content/actions";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageUrl: string | null;
  isActive: boolean;
};

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-black transition";
const labelClass = "block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1";

export function EditableBannerList({ banners }: { banners: Banner[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (banners.length === 0) return null;

  return (
    <div className="space-y-2">
      {banners.map((banner) =>
        editingId === banner.id ? (
          <div key={banner.id} className="rounded-md border border-black p-4 space-y-3">
            <form
              action={async (fd) => {
                await updateHero(banner.id, fd);
                setEditingId(null);
              }}
              className="space-y-3"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Headline</label>
                  <input name="title" defaultValue={banner.title} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Subheading</label>
                  <input name="subtitle" defaultValue={banner.subtitle ?? ""} className={inputClass} />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Button label</label>
                  <input name="ctaLabel" defaultValue={banner.ctaLabel ?? "Shop Here"} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Button link</label>
                  <input name="ctaHref" defaultValue={banner.ctaHref ?? "/shop"} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Image URL</label>
                <input name="imageUrl" defaultValue={banner.imageUrl ?? ""} className={inputClass} />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id={`active-${banner.id}`}
                  defaultChecked={banner.isActive}
                  className="h-4 w-4 rounded border-neutral-300 accent-black"
                />
                <label htmlFor={`active-${banner.id}`} className="text-sm text-neutral-700 cursor-pointer">
                  Live
                </label>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="inline-flex h-8 items-center px-4 rounded-md text-xs font-semibold text-white bg-black hover:bg-neutral-800 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="inline-flex h-8 items-center px-4 rounded-md text-xs font-semibold text-neutral-500 border border-neutral-200 hover:border-neutral-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div key={banner.id} className="flex items-center gap-3 rounded-md border border-neutral-100 p-3">
            {banner.imageUrl && (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-neutral-100">
                <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-black truncate">{banner.title}</p>
                <span
                  className={`shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                    banner.isActive
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {banner.isActive ? "Live" : "Hidden"}
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate">{banner.subtitle}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingId(banner.id)}
                className="text-xs text-neutral-400 hover:text-black transition-colors"
              >
                Edit
              </button>
              <form action={deleteHero.bind(null, banner.id)}>
                <button type="submit" className="text-xs text-neutral-400 hover:text-red-500 transition-colors">
                  Remove
                </button>
              </form>
            </div>
          </div>
        )
      )}
    </div>
  );
}
