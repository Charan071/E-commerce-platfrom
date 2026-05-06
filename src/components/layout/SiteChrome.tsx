"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <CartProvider>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "min-h-screen" : "flex-grow"}>{children}</main>
      {!isAdmin && <Footer />}
    </CartProvider>
  );
}
