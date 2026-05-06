"use client";

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
  Ticket,
  Mail,
  CreditCard,
  Truck,
  Receipt,
  Settings,
  ExternalLink,
} from "lucide-react";
import { clsx } from "clsx";

const NAV_MAIN = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: 28 },
  { label: "Products / Inventory", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

const NAV_MARKETING = [
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
];

const NAV_SETTINGS = [
  { label: "Payment Methods", href: "/admin/settings/payments", icon: CreditCard },
  { label: "Shipping", href: "/admin/settings/shipping", icon: Truck },
  { label: "Taxes", href: "/admin/settings/taxes", icon: Receipt },
  { label: "General Settings", href: "/admin/settings/general", icon: Settings },
];

function NavItem({
  href,
  icon: Icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
        isActive
          ? "bg-[#8b1a1a]/10 text-[#8b1a1a]"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <Icon
        className={clsx(
          "w-4.5 h-4.5 shrink-0",
          isActive ? "text-[#8b1a1a]" : "text-gray-400 group-hover:text-gray-600"
        )}
        size={18}
      />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="bg-[#8b1a1a] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1.5">
        {label}
      </p>
      <nav className="flex flex-col gap-0.5">{children}</nav>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="w-[210px] shrink-0 flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="bg-[#6b0f0f] px-5 py-5 flex flex-col items-center">
        <span className="text-white font-bold text-xl tracking-wide leading-none">AnavaSilks</span>
        <span className="text-[#f0c0a0] text-[10px] font-light tracking-[0.25em] uppercase mt-0.5">
          Silk and Sarees
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 pt-5">
        <NavSection label="Main">
          {NAV_MAIN.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavSection>

        <NavSection label="Marketing">
          {NAV_MARKETING.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavSection>

        <NavSection label="Store Settings">
          {NAV_SETTINGS.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavSection>

        {/* Promo card */}
        <div className="mx-1 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#6b0f0f] to-[#a0391a] p-4 text-white">
          <p className="font-semibold text-sm leading-tight">Premium Sarees,</p>
          <p className="font-semibold text-sm leading-tight mb-3">Timeless Elegance</p>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg font-medium"
          >
            View Store <ExternalLink size={11} />
          </Link>
        </div>
      </div>

      {/* Admin user */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-[#8b1a1a] flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
            <p className="text-[11px] text-gray-400 truncate">admin@anavasil...</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
