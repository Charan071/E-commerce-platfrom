"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";

type SiteChromeProps = {
  children: React.ReactNode;
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

export function SiteChrome({ children, user, brandName, navPromos, navCategories }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <CartProvider>
      {!isAdmin && (
        <Navbar user={user} brandName={brandName} navPromos={navPromos} navCategories={navCategories} />
      )}
      <main className={isAdmin ? "min-h-screen" : "flex-grow"}>{children}</main>
      {!isAdmin && <Footer />}
    </CartProvider>
  );
}
