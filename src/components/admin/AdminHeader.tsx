"use client";

import Link from "next/link";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/content": "Content Studio",
  "/admin/orders": "Orders",
  "/admin/products": "Inventory",
  "/admin/categories": "Categories",
  "/admin/customers": "Customers",
  "/admin/reviews": "Reviews",
  "/admin/newsletter": "Newsletter",
  "/admin/banners": "Banners",
  "/admin/coupons": "Coupons",
};

const PAGE_TITLE_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/content": "Brand / Hero / Media Blocks",
  "/admin/orders": "Orders",
  "/admin/products": "Inventory",
  "/admin/categories": "Categories",
  "/admin/customers": "Customers",
  "/admin/reviews": "Reviews",
  "/admin/newsletter": "Newsletter",
  "/admin/banners": "Banners",
  "/admin/coupons": "Coupons",
};

function getSearchPlaceholder(pathname: string) {
  if (pathname === "/admin/orders") return "Search orders…";
  if (pathname === "/admin/products") return "Search products…";
  return "Search products or orders…";
}

function pickTitle(pathname: string) {
  const exact = PAGE_TITLE_MAP[pathname];
  if (exact) return exact;
  const prefix = Object.keys(PAGE_TITLE_MAP)
    .filter((k) => k !== "/admin" && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return prefix ? PAGE_TITLE_MAP[prefix]! : "Admin";
}

function pickBreadcrumb(pathname: string) {
  const exact = BREADCRUMB_MAP[pathname];
  if (exact) return exact;
  const prefix = Object.keys(BREADCRUMB_MAP)
    .filter((k) => k !== "/admin" && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return prefix ? BREADCRUMB_MAP[prefix]! : "";
}

type AdminHeaderProps = {
  pendingOrdersCount: number;
  adminEmail: string | null | undefined;
  adminName: string | null | undefined;
  brandName: string;
};

export function AdminHeader({ pendingOrdersCount, adminEmail, adminName, brandName }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = pickTitle(pathname);
  const breadcrumb = pickBreadcrumb(pathname);
  const [search, setSearch] = useState("");

  const displayInitial =
    (adminName?.trim()?.charAt(0) || adminEmail?.trim()?.charAt(0) || "A").toUpperCase();
  const displayLabel = adminName?.trim() || adminEmail?.split("@")[0] || "Admin";

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    if (pathname.startsWith("/admin/orders")) {
      router.push(`/admin/orders?q=${encodeURIComponent(q)}`);
    } else {
      router.push(`/admin/products?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex h-full items-center gap-4">
        <button type="button" className="text-gray-500 hover:text-gray-700 lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-none text-gray-950">{title}</h1>
          <p className="mt-1 text-xs text-gray-400">
            {brandName}
            {breadcrumb && breadcrumb !== "Dashboard" && (
              <>
                <span className="mx-1.5 text-gray-300">/</span>
                {breadcrumb}
              </>
            )}
          </p>
        </div>

        <form
          onSubmit={onSearch}
          className="hidden w-64 items-center gap-2 rounded-lg border border-[#eadfd5] bg-white px-3 py-2 md:flex"
        >
          <Search size={15} className="shrink-0 text-gray-500" aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder={getSearchPlaceholder(pathname)}
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            aria-label="Admin search"
          />
        </form>

        <Link
          href="/admin/orders?status=PENDING"
          className="relative hidden p-1.5 text-gray-500 hover:text-gray-700 sm:inline-flex"
          aria-label={`Pending orders: ${pendingOrdersCount}`}
        >
          <Bell size={20} />
          {pendingOrdersCount > 0 ? (
            <span
              className="absolute right-0.5 top-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ backgroundColor: "var(--admin-primary)" }}
            >
              {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
            </span>
          ) : null}
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "var(--admin-primary)" }}
          >
            {displayInitial}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 md:block max-w-[10rem] truncate">
            {displayLabel}
          </span>
          <ChevronDown size={16} className="hidden text-gray-400 md:block" aria-hidden />
        </div>
      </div>
    </header>
  );
}
