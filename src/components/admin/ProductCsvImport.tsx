"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Download, Loader2, UploadCloud } from "lucide-react";

type ImportOk = { ok: true; imported: number; skipped: { row: number; message: string }[] };
type ImportErr = { ok: false; error: string; issues?: { row: number; message: string }[]; imported?: number; skipped?: { row: number; message: string }[] };

type Props = {
  disabled?: boolean;
  disabledReason?: string;
};

export function ProductCsvImport({ disabled, disabledReason }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string; detail?: string[] } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (!file) {
      setMessage({ kind: "err", text: "Choose a CSV file first." });
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/products/import", { method: "POST", body: fd });
      const data = (await res.json()) as ImportOk | ImportErr;

      if (!res.ok || !data || typeof data !== "object" || data.ok === false) {
        const err = data as ImportErr;
        const lines: string[] = [];
        if (err?.issues?.length) {
          lines.push(...err.issues.map((i) => (i.row ? `Row ${i.row}: ${i.message}` : i.message)));
        }
        if (err?.skipped?.length) {
          lines.push(...err.skipped.map((s) => `Row ${s.row}: ${s.message}`));
        }
        setMessage({
          kind: "err",
          text: err?.error ?? `Import failed (${res.status}).`,
          detail: lines.length ? lines : undefined,
        });
        return;
      }

      const ok = data as ImportOk;
      const detail: string[] = [];
      if (ok.skipped.length > 0) {
        detail.push(
          ...ok.skipped.slice(0, 25).map((s) => `Row ${s.row}: ${s.message}`),
          ...(ok.skipped.length > 25 ? [`…and ${ok.skipped.length - 25} more skipped rows.`] : [])
        );
      }
      setMessage({
        kind: "ok",
        text: ok.imported === 0 ? "No products were imported." : `Imported ${ok.imported} product(s).`,
        detail: detail.length ? detail : undefined,
      });
      if (ok.imported > 0) {
        input.value = "";
        router.refresh();
      }
    } catch {
      setMessage({ kind: "err", text: "Network error while uploading. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#e5d8cc] px-4 text-sm font-medium text-[#6b5040] hover:bg-[#f5ede3] transition-colors disabled:pointer-events-none disabled:opacity-50"
      >
        <UploadCloud size={16} />
        Import Products
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && !disabled && (
        <div className="absolute left-0 top-full z-20 mt-2 max-w-[calc(100vw-2.5rem)] w-[26rem] rounded-lg border border-[#eadfd5] bg-white p-4 text-left text-sm text-gray-700 shadow-lg">
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Required columns: <span className="font-medium text-gray-800">title</span>,{" "}
            <span className="font-medium text-gray-800">description</span>,{" "}
            <span className="font-medium text-gray-800">price</span>,{" "}
            <span className="font-medium text-gray-800">material</span>,{" "}
            <span className="font-medium text-gray-800">categorySlug</span>. Optional: slug, originalPrice, stock,
            isNew, sizes (comma-separated), discount, imageUrls (pipe | between URLs), colors (Name:#hex;…).
          </p>
          <a
            href="/api/admin/products/import/sample"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--admin-primary)] hover:underline"
          >
            <Download size={16} />
            Download sample CSV
          </a>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label className="block">
              <span className="sr-only">CSV file</span>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-md file:border file:border-[#eadfd5] file:bg-[#fbf6f1] file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-800"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--admin-primary)] px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {busy ? "Importing…" : "Upload & import"}
            </button>
          </form>
          {message && (
            <div
              className={
                message.kind === "ok"
                  ? "mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900"
                  : "mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900"
              }
            >
              <p className="font-medium">{message.text}</p>
              {message.detail?.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] opacity-90">
                  {message.detail.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
