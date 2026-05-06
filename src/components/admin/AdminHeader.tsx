"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/customers": "Customers",
  "/admin/reviews": "Reviews",
};

const PAGE_TITLE_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Inventory / Products",
  "/admin/categories": "Categories",
  "/admin/customers": "Customers",
  "/admin/reviews": "Reviews",
};

function getSearchPlaceholder(pathname: string) {
  if (pathname === "/admin/orders") return "Search orders...";
  if (pathname === "/admin/products") return "Search products...";
  return "Search anything...";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLE_MAP[pathname] ?? "Admin";
  const breadcrumb = BREADCRUMB_MAP[pathname] ?? "";

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex h-full items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-none text-gray-950">{title}</h1>
          <p className="mt-1 text-xs text-gray-400">
            Dashboard
            {breadcrumb && breadcrumb !== "Dashboard" && (
              <>
                <span className="mx-1.5 text-gray-300">/</span>
                {breadcrumb}
              </>
            )}
          </p>
        </div>

        <div className="hidden w-64 items-center gap-2 rounded-lg border border-[#eadfd5] bg-white px-3 py-2 md:flex">
          <Search size={15} className="shrink-0 text-gray-500" />
          <input
            type="text"
            placeholder={getSearchPlaceholder(pathname)}
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <button className="relative p-1.5 text-gray-500 hover:text-gray-700" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#8b1a1a] text-[9px] font-bold text-white">
            5
          </span>
        </button>

        <button className="flex items-center gap-2" type="button">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b1a1a] text-xs font-bold text-white">
            A
          </div>
          <span className="hidden text-sm font-medium text-gray-700 md:block">Admin User</span>
          <ChevronDown size={16} className="hidden text-gray-400 md:block" />
        </button>
      </div>
    </header>
  );
}
