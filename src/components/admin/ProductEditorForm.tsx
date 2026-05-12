"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, X, Plus, FolderOpen, Loader2 } from "lucide-react";
import { fetchCloudinaryFolder } from "@/app/admin/products/actions";

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
  sizes: string[];
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
  "mt-1 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-black transition";

const labelClass = "text-[10px] font-semibold uppercase tracking-wider text-neutral-400";

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
  const [sizes, setSizes] = useState<string[]>(initialValues.sizes);
  const [sizeInput, setSizeInput] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialValues.categoryId);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [images, setImages] = useState<ImageEntry[]>(
    initialValues.images.length > 0 ? initialValues.images : [{ ...EMPTY_IMAGE }]
  );
  const [folderUrl, setFolderUrl] = useState("");
  const [folderImages, setFolderImages] = useState<{ url: string; publicId: string }[]>([]);
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderError, setFolderError] = useState("");
  const [showFolderImport, setShowFolderImport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await action(new FormData(e.currentTarget));
      setSaved(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => setSaved(false), 4000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {saved && (
        <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 mb-4 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-black shrink-0" />
          <p className="text-sm font-medium text-black">Product saved successfully.</p>
        </div>
      )}
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[3fr_2fr]">
      {/* ── Left: core product fields ── */}
      <div className="rounded-lg border border-neutral-100 bg-white p-6 space-y-5">
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
            <label className={labelClass}>Slug <span className="normal-case font-normal text-neutral-400">(auto-generated if blank)</span></label>
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
            <label className={labelClass}>Price <span className="font-normal text-neutral-400">(₹)</span></label>
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
            <label className={labelClass}>Original <span className="font-normal text-neutral-400">(₹)</span></label>
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
              className={inputClass + " bg-neutral-50 cursor-default"}
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

        {/* Sizes */}
        <div>
          <label className={labelClass}>
            Sizes <span className="normal-case font-normal text-neutral-400">(optional — blouse sizes, XS/S/M/L etc.)</span>
          </label>
          <div className="mt-1 flex gap-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === ",") && sizeInput.trim()) {
                  e.preventDefault();
                  const val = sizeInput.trim().replace(/,/g, "");
                  if (val && !sizes.includes(val)) setSizes((prev) => [...prev, val]);
                  setSizeInput("");
                }
              }}
              placeholder='Type a size and press Enter — e.g. "34" or "S"'
              className={inputClass + " flex-1"}
            />
            <button
              type="button"
              onClick={() => {
                const val = sizeInput.trim().replace(/,/g, "");
                if (val && !sizes.includes(val)) setSizes((prev) => [...prev, val]);
                setSizeInput("");
              }}
              className="mt-1 shrink-0 h-9 px-3 rounded-md border border-neutral-200 bg-white text-sm text-black hover:bg-neutral-50 transition-colors"
            >
              Add
            </button>
          </div>
          {sizes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <span key={size} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  {size}
                  <button
                    type="button"
                    onClick={() => setSizes((prev) => prev.filter((s) => s !== size))}
                    className="text-neutral-400 hover:text-black transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input type="hidden" name="sizes" value={sizes.join(",")} />
        </div>
      </div>

      {/* ── Right: preview + images + publish ── */}
      <div className="flex flex-col gap-4">
        {/* Live preview card — desktop only */}
        <div className="hidden lg:block rounded-lg border border-neutral-100 bg-white p-4">
          <p className={labelClass + " mb-3"}>Live card preview</p>
          <div className="overflow-hidden rounded-md border border-neutral-100 bg-neutral-50">
            <div className="relative aspect-[3/4] bg-neutral-100">
              {hasPreviewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewImageUrl}
                  alt={title || "Product preview"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-10 w-10 text-neutral-300" strokeWidth={1.4} />
                  <span className="text-xs text-neutral-400 tracking-wide">Paste an image URL below</span>
                </div>
              )}
              {discountLabel && (
                <span className="absolute left-2 top-2 rounded bg-white/95 px-2 py-1 text-[10px] font-semibold text-black">
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
              <p className="line-clamp-2 text-sm font-medium text-black">{title || "Product title"}</p>
              <p className="text-xs text-neutral-400">{selectedCategory}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-black">
                  {hasValidPrice ? `Rs. ${previewPrice.toLocaleString("en-IN")}` : "Rs. 0"}
                </span>
                {hasValidOriginalPrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    Rs. {previewOriginalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{material || "Material"}</p>
              <p className="text-xs text-neutral-400">{stockState}</p>
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
                  className="h-12 w-9 shrink-0 rounded object-cover border border-neutral-100"
                />
              ))}
            </div>
          )}
          <p className="mt-2 text-[11px] text-neutral-400">Preview updates as you type.</p>
        </div>

        {/* Images + publish — always visible */}
        <div className="rounded-lg border border-neutral-100 bg-white p-5 space-y-5">
          {/* Multi-image manager */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass}>Product images</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setShowFolderImport((v) => !v); setFolderImages([]); setFolderError(""); }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Import folder
                </button>
                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:opacity-60 transition-opacity"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>
            </div>

            {/* Cloudinary folder import */}
            {showFolderImport && (
              <div className="mb-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Import from Cloudinary folder
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={folderUrl}
                    onChange={(e) => { setFolderUrl(e.target.value); setFolderError(""); }}
                    placeholder="Folder path or full URL — e.g. anavasilks/products/kanchipuram"
                    className="flex-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-black placeholder:text-neutral-400 outline-none focus:border-black transition"
                  />
                  <button
                    type="button"
                    disabled={!folderUrl.trim() || folderLoading}
                    onClick={async () => {
                      setFolderLoading(true);
                      setFolderError("");
                      setFolderImages([]);
                      try {
                        const results = await fetchCloudinaryFolder(folderUrl);
                        if (results.length === 0) setFolderError("No images found in that folder.");
                        else setFolderImages(results);
                      } catch {
                        setFolderError("Could not fetch folder. Check the path and try again.");
                      } finally {
                        setFolderLoading(false);
                      }
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40"
                  >
                    {folderLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Fetch"}
                  </button>
                </div>

                {folderError && (
                  <p className="text-xs text-red-500">{folderError}</p>
                )}

                {folderImages.length > 0 && (
                  <div>
                    <p className="text-[10px] text-neutral-400 mb-2">{folderImages.length} images found — click to add</p>
                    <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto">
                      {folderImages.map((img) => {
                        const alreadyAdded = images.some((i) => i.url === img.url);
                        return (
                          <button
                            key={img.publicId}
                            type="button"
                            disabled={alreadyAdded}
                            onClick={() => {
                              setImages((prev) => {
                                const filtered = prev.filter((i) => i.url.trim());
                                return [...filtered, { url: img.url, isHover: false }];
                              });
                            }}
                            className={`relative aspect-square overflow-hidden rounded border transition-all ${
                              alreadyAdded
                                ? "border-black opacity-50 cursor-default"
                                : "border-neutral-200 hover:border-black cursor-pointer"
                            }`}
                            title={alreadyAdded ? "Already added" : "Click to add"}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                            {alreadyAdded && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold">✓</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}


            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="rounded-md border border-neutral-100 bg-neutral-50 p-3 space-y-2">
                  <div className="flex items-start gap-2.5">
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt=""
                        className="h-14 w-11 shrink-0 rounded object-cover border border-[#e5d8cc]"
                      />
                    ) : (
                      <div className="h-14 w-11 shrink-0 rounded border border-dashed border-neutral-200 bg-white flex items-center justify-center">
                        <ImagePlus className="h-5 w-5 text-neutral-300" strokeWidth={1.4} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        name={`imageUrl_${idx}`}
                        type="url"
                        value={img.url}
                        onChange={(e) => updateUrl(idx, e.target.value)}
                        placeholder="https://res.cloudinary.com/…"
                        className="w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-black placeholder:text-neutral-400 outline-none focus:border-black transition"
                      />
                    </div>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label="Remove image"
                        className="mt-1 shrink-0 text-neutral-300 hover:text-black transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {idx === 0 && (
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Primary</span>
                    )}
                    <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name={`imageHover_${idx}`}
                        checked={img.isHover}
                        onChange={() => toggleHover(idx)}
                        className="h-3 w-3 rounded border-neutral-300 accent-black"
                      />
                      Hover image
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-neutral-400">Paste Cloudinary delivery URLs. First image is the primary gallery image.</p>
          </div>

          {/* New arrival flag */}
          <label className="inline-flex items-center gap-2 text-sm text-neutral-700 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isNew"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 accent-black"
            />
            Mark as New Arrival
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white tracking-wide hover:opacity-90 disabled:opacity-60 transition-opacity bg-black"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
    </>
  );
}
