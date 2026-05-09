"use client";

import { useMemo, useState } from "react";
import { ImagePlus, X, Plus } from "lucide-react";

type CategoryOption = {
  id: string;
  name: string;
};

type ImageEntry = {
  url: string;
  isHover: boolean;
};

type ProductFormInitialValues = {
  title: string;
  slug: string;
  description: string;
  price: string;
  originalPrice: string;
  stock: string;
  discount: string;
  categoryId: string;
  material: string;
  images: ImageEntry[];
  isNew: boolean;
};

type ProductEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  categories: CategoryOption[];
  initialValues: ProductFormInitialValues;
};

const ADD_CATEGORY_VALUE = "__add_category__";

function buildDiscountLabel(priceValue: string, originalPriceValue: string) {
  const price = Number(priceValue);
  const original = Number(originalPriceValue);
  if (!Number.isFinite(price) || !Number.isFinite(original)) return "";
  if (original <= 0 || price <= 0 || original <= price) return "";
  const pct = Math.round(((original - price) / original) * 100);
  return pct > 0 ? `${pct}% OFF` : "";
}

const EMPTY_IMAGE: ImageEntry = { url: "", isHover: false };

const inputClass =
  "mt-1 w-full rounded-md border border-[#e5d8cc] bg-white px-3 py-2 text-sm text-[#1e140d] placeholder:text-[#b09880] outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)]/20 transition";

const labelClass = "text-[11px] font-semibold uppercase tracking-widest text-[#9c8270]";

export function ProductEditorForm({
  action,
  submitLabel,
  categories,
  initialValues,
}: ProductEditorFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [material, setMaterial] = useState(initialValues.material);
  const [price, setPrice] = useState(initialValues.price);
  const [originalPrice, setOriginalPrice] = useState(initialValues.originalPrice);
  const [stock, setStock] = useState(initialValues.stock);
  const [isNew, setIsNew] = useState(initialValues.isNew);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialValues.categoryId);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [images, setImages] = useState<ImageEntry[]>(
    initialValues.images.length > 0 ? initialValues.images : [{ ...EMPTY_IMAGE }]
  );

  const discountLabel = useMemo(
    () => buildDiscountLabel(price, originalPrice) || initialValues.discount || "",
    [price, originalPrice, initialValues.discount]
  );

  const shouldAddCategory = selectedCategoryId === ADD_CATEGORY_VALUE;
  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId)?.name ||
    (shouldAddCategory && newCategoryName ? newCategoryName : "Uncategorized");

  const hasPreviewImage = images.some((img) => img.url.trim());
  const previewImageUrl = images.find((img) => img.url.trim())?.url ?? "";
  const previewPrice = Number(price);
  const previewOriginalPrice = Number(originalPrice);
  const hasValidPrice = Number.isFinite(previewPrice) && previewPrice > 0;
  const hasValidOriginalPrice =
    Number.isFinite(previewOriginalPrice) &&
    previewOriginalPrice > previewPrice &&
    previewOriginalPrice > 0;
  const numericStock = Number(stock);
  const stockState =
    !Number.isFinite(numericStock) || numericStock <= 0
      ? "Out of stock"
      : numericStock <= 5
        ? "Low stock"
        : "In stock";

  function addImage() {
    setImages((prev) => [...prev, { ...EMPTY_IMAGE }]);
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateUrl(idx: number, url: string) {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, url } : img)));
  }

  function toggleHover(idx: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isHover: i === idx ? !img.isHover : img.isHover }))
    );
  }

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[3fr_2fr]">
      {/* ── Left: core product fields ── */}
      <div className="rounded-xl border border-[#e5d8cc] bg-white p-6 shadow-sm space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kanchipuram Silk Saree"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug <span className="normal-case font-normal text-[#b09880]">(auto-generated if blank)</span></label>
            <input
              name="slug"
              defaultValue={initialValues.slug}
              placeholder="kanchipuram-silk-saree"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the fabric, weave, occasion, and care instructions…"
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div>
            <label className={labelClass}>Price <span className="font-normal text-[#b09880]">(₹)</span></label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Original <span className="font-normal text-[#b09880]">(₹)</span></label>
            <input
              name="originalPrice"
              type="number"
              min="0"
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Discount label</label>
            <input
              value={discountLabel}
              readOnly
              placeholder="Auto-calculated"
              className={inputClass + " bg-[#faf8f5] cursor-default"}
            />
            <input type="hidden" name="discount" value={discountLabel} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Category</label>
            <select
              name="categoryId"
              required
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={inputClass + " appearance-none bg-white cursor-pointer"}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value={ADD_CATEGORY_VALUE}>+ Add new category</option>
            </select>
            {shouldAddCategory && (
              <input
                name="newCategoryName"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className={inputClass + " mt-2"}
              />
            )}
          </div>
          <div>
            <label className={labelClass}>Material / Fabric</label>
            <input
              name="material"
              required
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. Pure Silk"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ── Right: preview + images + publish ── */}
      <div className="flex flex-col gap-4">
        {/* Live preview card — desktop only */}
        <div className="hidden lg:block rounded-xl border border-[#e5d8cc] bg-white p-4 shadow-sm">
          <p className={labelClass + " mb-3"}>Live card preview</p>
          <div className="overflow-hidden rounded-lg border border-[#e5d8cc] bg-[#faf8f5]">
            <div className="relative aspect-[3/4] bg-[#f0e6dc]">
              {hasPreviewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewImageUrl}
                  alt={title || "Product preview"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-10 w-10 text-[#c9b09c]" strokeWidth={1.4} />
                  <span className="text-xs text-[#b09880] tracking-wide">Paste an image URL below</span>
                </div>
              )}
              {discountLabel && (
                <span className="absolute left-2 top-2 rounded bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#2c1810]">
                  {discountLabel}
                </span>
              )}
              {isNew && (
                <span
                  className="absolute right-2 top-2 rounded px-2 py-1 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: "var(--admin-primary)" }}
                >
                  NEW
                </span>
              )}
            </div>
            <div className="space-y-1 p-3">
              <p className="line-clamp-2 text-sm font-medium text-[#1e140d]">{title || "Product title"}</p>
              <p className="text-xs text-[#9c8270]">{selectedCategory}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-[#1e140d]">
                  {hasValidPrice ? `Rs. ${previewPrice.toLocaleString("en-IN")}` : "Rs. 0"}
                </span>
                {hasValidOriginalPrice && (
                  <span className="text-xs text-[#9c8270] line-through">
                    Rs. {previewOriginalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7c6652]">{material || "Material"}</p>
              <p className="text-xs text-[#9c8270]">{stockState}</p>
            </div>
          </div>
          {images.filter((img) => img.url).length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.filter((img) => img.url).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img.url}
                  alt={`Image ${i + 1}`}
                  className="h-12 w-9 shrink-0 rounded object-cover border border-[#e5d8cc]"
                />
              ))}
            </div>
          )}
          <p className="mt-2 text-[11px] text-[#b09880]">
            Preview updates as you type.
          </p>
        </div>

        {/* Images + publish — always visible */}
        <div className="rounded-xl border border-[#e5d8cc] bg-white p-5 shadow-sm space-y-5">
          {/* Multi-image manager */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass}>Product images</label>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--admin-primary)] hover:opacity-75 transition-opacity"
              >
                <Plus className="h-3.5 w-3.5" />
                Add image
              </button>
            </div>

            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="rounded-lg border border-[#e5d8cc] bg-[#faf8f5] p-3 space-y-2">
                  <div className="flex items-start gap-2.5">
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt=""
                        className="h-14 w-11 shrink-0 rounded object-cover border border-[#e5d8cc]"
                      />
                    ) : (
                      <div className="h-14 w-11 shrink-0 rounded border border-dashed border-[#d4c4b4] bg-white flex items-center justify-center">
                        <ImagePlus className="h-5 w-5 text-[#c9b09c]" strokeWidth={1.4} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        name={`imageUrl_${idx}`}
                        type="url"
                        value={img.url}
                        onChange={(e) => updateUrl(idx, e.target.value)}
                        placeholder="https://res.cloudinary.com/…"
                        className="w-full rounded-md border border-[#e5d8cc] bg-white px-2 py-1.5 text-xs text-[#1e140d] placeholder:text-[#c9b09c] outline-none focus:border-[var(--admin-primary)] transition"
                      />
                    </div>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label="Remove image"
                        className="mt-1 shrink-0 text-[#c9b09c] hover:text-[var(--admin-primary)] transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {idx === 0 && (
                      <span className="text-[10px] uppercase tracking-widest text-[#b09880] font-semibold">
                        Primary
                      </span>
                    )}
                    <label className="flex items-center gap-1.5 text-xs text-[#6b5040] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name={`imageHover_${idx}`}
                        checked={img.isHover}
                        onChange={() => toggleHover(idx)}
                        className="h-3 w-3 rounded border-[#d4c4b4]"
                      />
                      Hover image
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-[#b09880]">
              Paste Cloudinary delivery URLs. First image is the primary gallery image.
            </p>
          </div>

          {/* New arrival flag */}
          <label className="inline-flex items-center gap-2 text-sm text-[#6b5040] cursor-pointer select-none">
            <input
              type="checkbox"
              name="isNew"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="h-4 w-4 rounded border-[#d4c4b4]"
            />
            Mark as New Arrival
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-white tracking-wide shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--admin-primary)" }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
