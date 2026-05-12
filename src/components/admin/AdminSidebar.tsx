"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Users,
  Star,
  Image,
  Mail,
  CreditCard,
  Settings,
  ExternalLink,
} from "lucide-react";
import { clsx } from "clsx";

type NavItemConfig = {
  label: string;
  href: string;
  icon: ElementType;
  badge?: number;
};

function NavItem({ href, icon: Icon, label, badge }: NavItemConfig) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group",
        isActive
          ? "bg-neutral-100 text-black font-medium"
          : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
      )}
    >
      <Icon
        className={clsx(
          "shrink-0",
          isActive ? "text-black" : "text-neutral-400 group-hover:text-black"
        )}
        size={15}
      />
      <span className="flex-1 leading-none">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none bg-black">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-300 px-3 mb-1.5">
        {label}
      </p>
      <nav className="flex flex-col gap-0.5">{children}</nav>
    </div>
  );
}

function buildMainNav(pendingOrders: number): NavItemConfig[] {
  return [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: pendingOrders },
    { label: "Inventory", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Tag },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
  ];
}

const NAV_MARKETING: NavItemConfig[] = [
  { label: "Content Studio", href: "/admin/content", icon: Image },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
];

const NAV_SETTINGS: NavItemConfig[] = [
  { label: "Payments", href: "/admin/settings/payments", icon: CreditCard },
  { label: "General", href: "/admin/settings/general", icon: Settings },
];

type AdminSidebarProps = {
  pendingOrdersCount: number;
  adminEmail: string;
  adminName: string;
  brandName: string;
  brandTagline: string;
};

export function AdminSidebar({ pendingOrdersCount, adminEmail, adminName, brandName, brandTagline }: AdminSidebarProps) {
  const mainNav = buildMainNav(pendingOrdersCount);
  const shortEmail = adminEmail.length > 22 ? `${adminEmail.slice(0, 20)}…` : adminEmail;

  return (
    <aside className="w-[216px] shrink-0 flex flex-col h-full bg-white border-r border-neutral-100">
      {/* Brand header */}
      <div className="px-5 py-5 flex flex-col items-center gap-0.5 bg-black">
        <span className="font-serif text-white text-[21px] tracking-[0.18em] leading-none">
          {brandName}
        </span>
        <span className="text-[9px] font-light tracking-[0.28em] uppercase mt-1 text-white/50">
          {brandTagline}
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 pt-5 pb-2">
        <NavSection label="Main">
          {mainNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavSection>

        <NavSection label="Marketing">
          {NAV_MARKETING.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavSection>

        <NavSection label="Store">
          {NAV_SETTINGS.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavSection>

        {/* View store link */}
        <div className="mx-1 mb-3 rounded-lg border border-neutral-100 p-4">
          <p className="text-sm font-medium text-black leading-tight">Storefront</p>
          <p className="text-[11px] text-neutral-400 mt-0.5 mb-3">Preview the live site.</p>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] bg-black text-white px-3 py-1.5 rounded-md font-medium hover:bg-neutral-800 transition-colors"
          >
            View Store <ExternalLink size={10} />
          </Link>
        </div>
      </div>

      {/* Admin profile */}
      <div className="border-t border-neutral-100 px-3 py-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(adminName.trim().charAt(0) || adminEmail.charAt(0) || "A").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate leading-none mb-0.5">
              {adminName.trim() || "Administrator"}
            </p>
            <p className="text-[11px] text-neutral-400 truncate" title={adminEmail}>
              {shortEmail}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
