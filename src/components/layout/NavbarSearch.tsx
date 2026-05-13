"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const POPULAR_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Contact Us", href: "/about" },
];

export function NavbarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(trimmed ? `/shop?${params.toString()}` : "/shop");
    setOpen(false);
    setQ("");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search products"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="hover:text-[var(--color-text)] transition-colors"
      >
        <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-[90] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Search overlay panel */}
      <div
        className={`fixed top-0 left-0 right-0 z-[100] bg-white transition-transform duration-200 ease-out pt-safe ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Input row */}
        <form
          onSubmit={submit}
          className="flex items-center gap-4 px-6 lg:px-12 border-b border-neutral-200"
          style={{ height: "80px" }}
        >
          <Search size={18} strokeWidth={1.5} className="shrink-0 text-neutral-400" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="flex-1 text-xl text-[var(--color-text)] outline-none placeholder:text-neutral-300 bg-transparent"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="shrink-0 text-neutral-400 hover:text-[var(--color-text)] transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </form>

        {/* Popular searches */}
        <div className="px-6 lg:px-12 py-6 max-w-screen-2xl mx-auto">
          <p className="font-serif text-base text-neutral-500 mb-3">Popular searches</p>
          <div className="h-px bg-neutral-100 mb-5" />
          <nav className="space-y-3">
            {POPULAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-[10px] tracking-[0.22em] uppercase text-neutral-500 hover:text-[var(--color-text)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
