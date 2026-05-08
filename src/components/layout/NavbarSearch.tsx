"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function NavbarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    const suffix = params.toString();
    router.push(suffix ? `/shop?${suffix}` : "/shop");
    setOpen(false);
    setQ("");
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Search products"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="hover:text-[var(--color-text)] transition-colors"
      >
        <Search className="w-[18px] h-[18px]" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/20 md:bg-transparent"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          />
          <form
            onSubmit={submit}
            className="absolute right-0 top-full z-[70] mt-3 flex w-[min(92vw,320px)] items-center gap-2 border border-neutral-200 bg-[var(--color-surface)] px-3 py-2 shadow-lg"
          >
            <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, fabric…"
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-text-muted"
              aria-label="Search query"
            />
            <button type="submit" className="text-xs uppercase tracking-[0.14em] text-[var(--color-text)]">
              Go
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1 text-text-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
