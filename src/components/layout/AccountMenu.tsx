"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  User as UserIcon,
  Heart,
} from "lucide-react";
import { logout } from "@/app/auth/actions";

type AccountMenuProps = {
  email: string;
  name: string | null;
  isAdmin: boolean;
};

function getInitials(name: string | null, email: string) {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
    return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
  }
  const local = (email.split("@")[0] ?? "").replace(/[^a-zA-Z]/g, "");
  if (local.length === 0) return "U";
  if (local.length === 1) return local[0]!.toUpperCase();
  return (local[0]! + local[1]!).toUpperCase();
}

function getDisplayName(name: string | null, email: string) {
  if (name && name.trim().length > 0) return name.trim();
  return email.split("@")[0] ?? email;
}

export function AccountMenu({ email, name, isAdmin }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const initials = getInitials(name, email);
  const displayName = getDisplayName(name, email);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white tracking-wider hover:bg-neutral-800 transition-colors"
        aria-label={`Account menu for ${displayName}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 origin-top-right rounded-md border border-neutral-200 bg-white p-2 shadow-xl"
        >
          <div className="px-3 pt-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            Signed in as
          </div>
          <div className="px-3 pb-1 text-sm font-semibold text-neutral-900 truncate">{displayName}</div>
          <div className="px-3 pb-2 text-xs text-neutral-500 truncate">{email}</div>

          <div className="my-1 h-px bg-neutral-100" />

          <Link
            href="/account"
            role="menuitem"
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
            onClick={() => setOpen(false)}
          >
            <UserIcon size={16} />
            My Account
          </Link>
          <Link
            href="/account/orders"
            role="menuitem"
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
            onClick={() => setOpen(false)}
          >
            <Package size={16} />
            Orders
          </Link>
          <Link
            href="/account/addresses"
            role="menuitem"
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
            onClick={() => setOpen(false)}
          >
            <MapPin size={16} />
            Addresses
          </Link>
          <Link
            href="/account/wishlist"
            role="menuitem"
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
            onClick={() => setOpen(false)}
          >
            <Heart size={16} />
            Wishlist
          </Link>

          {isAdmin && (
            <>
              <div className="my-1 h-px bg-neutral-100" />
              <Link
                href="/admin"
                role="menuitem"
                className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-black hover:bg-neutral-50"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </Link>
            </>
          )}

          <div className="my-1 h-px bg-neutral-100" />

          <form action={logout}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
            >
              <LogOut size={16} />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
