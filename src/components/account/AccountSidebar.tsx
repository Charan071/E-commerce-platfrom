"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, MapPin, Package, User as UserIcon } from "lucide-react";
import { clsx } from "clsx";
import { logout } from "@/app/auth/actions";

const ITEMS = [
  { href: "/account", label: "Profile", icon: UserIcon },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

type AccountSidebarProps = {
  email: string;
  name: string | null;
};

function getInitial(name: string | null, email: string) {
  if (name && name.trim().length > 0) return name.trim().charAt(0).toUpperCase();
  return (email.charAt(0) || "U").toUpperCase();
}

export function AccountSidebar({ email, name }: AccountSidebarProps) {
  const pathname = usePathname();
  const displayName = name && name.trim().length > 0 ? name.trim() : email.split("@")[0];
  const initial = getInitial(name, email);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-2xl border border-[#eadfd5] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-[#eadfd5]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">{displayName}</p>
            <p className="truncate text-xs text-text/60">{email}</p>
          </div>
        </div>

        <nav className="mt-3 flex flex-col gap-1">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/account" ? pathname === "/account" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text hover:bg-surface"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}

          <form action={logout} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text hover:bg-surface"
            >
              <LogOut size={16} />
              Log out
            </button>
          </form>
        </nav>
      </div>
    </aside>
  );
}
