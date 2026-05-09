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

function NavItem({
  href,
  icon: Icon,
  label,
  badge,
}: {
  href: string;
  icon: ElementType;
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
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
        isActive
          ? "text-[var(--admin-primary)]"
          : "text-[#6b5040] hover:bg-[#f0e6da] hover:text-[#2c1810]"
      )}
      style={
        isActive
          ? { backgroundColor: "color-mix(in srgb, var(--admin-primary) 10%, white)" }
          : undefined
      }
    >
      <Icon
        className={clsx(
          "shrink-0",
          isActive
            ? "text-[var(--admin-primary)]"
            : "text-[#a8927c] group-hover:text-[#6b5040]"
        )}
        size={16}
      />
      <span className="flex-1 leading-none">{label}</span>
      {badge !== undefined && badge > 0 ? (
        <span
          className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
          style={{ backgroundColor: "var(--admin-primary)" }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c4a88e] px-3 mb-1.5">
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

export function AdminSidebar({
  pendingOrdersCount,
  adminEmail,
  adminName,
  brandName,
  brandTagline,
}: AdminSidebarProps) {
  const mainNav = buildMainNav(pendingOrdersCount);
  const shortEmail = adminEmail.length > 22 ? `${adminEmail.slice(0, 20)}…` : adminEmail;

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-[#faf7f4] border-r border-[#e5d8cc]">
      {/* Brand header */}
      <div
        className="px-5 py-5 flex flex-col items-center gap-0.5"
        style={{ backgroundColor: "var(--admin-primary)" }}
      >
        <span className="font-serif text-white text-[22px] tracking-[0.18em] leading-none">
          {brandName}
        </span>
        <span className="text-[9px] font-light tracking-[0.3em] uppercase mt-1 text-white/70">
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

        {/* View store card */}
        <div
          className="mx-1 mb-3 rounded-xl overflow-hidden p-4 text-white"
          style={{ background: "linear-gradient(135deg, var(--admin-primary), var(--admin-accent))" }}
        >
          <p className="font-serif text-base leading-tight">Storefront</p>
          <p className="text-[11px] opacity-80 mt-0.5 mb-3">Preview the live site.</p>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg font-medium"
          >
            View Store <ExternalLink size={10} />
          </Link>
        </div>
      </div>

      {/* Admin profile */}
      <div className="border-t border-[#e5d8cc] px-3 py-3">
        <div className="flex items-center gap-2.5 px-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: "var(--admin-primary)" }}
          >
            {(adminName.trim().charAt(0) || adminEmail.charAt(0) || "A").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#2c1810] truncate leading-none mb-0.5">
              {adminName.trim() || "Administrator"}
            </p>
            <p className="text-[11px] text-[#a8927c] truncate" title={adminEmail}>
              {shortEmail}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
