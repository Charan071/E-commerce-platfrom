"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { NavbarSearch } from "@/components/layout/NavbarSearch";


type NavbarProps = {
  user: { email: string; name: string | null; isAdmin: boolean } | null;
  brandName: string;
  navPromos: Array<{
    id: string;
    title: string;
    subtitle: string;
    href: string;
    imageUrl: string;
    imageHasEmbeddedText: boolean;
  }>;
  navCategories: Array<{ name: string; slug: string }>;
};

const DISCOVER_LINKS = [
  { label: "Shop all", href: "/shop" },
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/about" },
];

export default function Navbar({ user, brandName, navPromos, navCategories }: NavbarProps) {
  const { cartCount } = useCart();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openShopMenu() {
    clearCloseTimer();
    setIsShopOpen(true);
  }

  function closeShopMenuWithDelay() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsShopOpen(false);
    }, 150);
  }

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-surface)] border-b border-neutral-200">
      <div className="bg-[var(--color-text)] text-[var(--color-surface)] text-[10px] sm:text-[11px] py-2 px-4 text-center tracking-[0.18em] uppercase font-light">
        Free Shipping On Orders Above ₹5,000 &nbsp;·&nbsp; Easy Returns &nbsp;·&nbsp; COD Available
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-3 items-center h-20">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[12px] font-medium tracking-[var(--nav-letter-spacing)] uppercase text-neutral-800 hover:text-[var(--color-text)] transition-colors"
            >
              Home
            </Link>
            <div className="relative" onMouseEnter={openShopMenu} onMouseLeave={closeShopMenuWithDelay}>
              <Link
                href="/shop"
                className="text-[12px] font-medium tracking-[var(--nav-letter-spacing)] uppercase text-neutral-800 hover:text-[var(--color-text)] transition-colors"
                onFocus={openShopMenu}
                onBlur={closeShopMenuWithDelay}
              >
                Shop
              </Link>
            </div>
            <Link
              href="/about"
              className="text-[12px] font-medium tracking-[var(--nav-letter-spacing)] uppercase text-neutral-800 hover:text-[var(--color-text)] transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <Link
            href="/"
            className="justify-self-center font-serif text-2xl sm:text-[28px] tracking-[0.32em] uppercase text-neutral-900 whitespace-nowrap"
            aria-label={brandName}
          >
            {brandName}
          </Link>

          <div className="justify-self-end flex items-center gap-5 sm:gap-6 text-neutral-800">
            <NavbarSearch />

            {user ? (
              <AccountMenu email={user.email} name={user.name} isAdmin={user.isAdmin} />
            ) : (
              <Link
                href="/login"
                aria-label="Account"
                className="hover:text-[var(--color-text)] transition-colors"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
            )}

            <Link href="/cart" aria-label="Cart" className="relative hover:text-[var(--color-text)] transition-colors">
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-text)] text-[var(--color-surface)] text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className="md:hidden border-t border-neutral-200 py-2 px-4 flex justify-center gap-6 text-[11px] tracking-[var(--nav-letter-spacing)] uppercase text-neutral-700">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/about">Contact Us</Link>
      </nav>

      {isShopOpen && (
        <div
          className="hidden md:block absolute left-0 right-0 top-full bg-[var(--color-background)] border-t border-neutral-200 border-b border-neutral-200 shadow-sm"
          onMouseEnter={openShopMenu}
          onMouseLeave={closeShopMenuWithDelay}
        >
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-[1fr_1fr_1.4fr] gap-8">
            <div>
              <h3 className="font-serif text-xl mb-3 text-neutral-900">Shop by category</h3>
              <ul className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                {navCategories.length === 0 ? (
                  <li className="text-sm text-text-muted">Browse all in Shop — add categories in Admin.</li>
                ) : (
                  navCategories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="text-sm text-neutral-700 hover:text-[var(--color-text)] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl mb-3 text-neutral-900">Discover</h3>
              <ul className="space-y-1.5">
                {DISCOVER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-700 hover:text-[var(--color-text)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {navPromos.slice(0, 2).map((promo) => (
                <Link
                  key={promo.id}
                  href={promo.href || "/shop"}
                  className="relative h-[330px] overflow-hidden group"
                >
                  <Image
                    src={promo.imageUrl}
                    alt={promo.title}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  {!promo.imageHasEmbeddedText && (
                    <div className="absolute left-4 bottom-4 text-white">
                      <p className="font-serif text-2xl md:text-3xl">{promo.title}</p>
                      <p className="text-sm mt-1">{promo.subtitle}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
