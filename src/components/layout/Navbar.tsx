"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 flex justify-center items-center font-medium tracking-wide">
        FREE SHIPPING ON ORDERS ABOVE ₹5,000 &nbsp;|&nbsp; EASY RETURNS &nbsp;|&nbsp; COD AVAILABLE
      </div>
      
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-serif text-primary font-bold tracking-tight">
              AnavaSilks
              <span className="block text-[10px] uppercase tracking-widest font-sans text-primary/80 font-normal -mt-1">Silk and Sarees</span>
            </Link>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary">Home</Link>
            <Link href="/shop" className="text-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary">Shop</Link>
            <Link href="/collections" className="text-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary">Collections</Link>
            <Link href="/new-arrivals" className="text-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary">New Arrivals</Link>
            <Link href="/about" className="text-text hover:text-primary px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary">About Us</Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-text hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-text hover:text-primary transition-colors relative">
              <Heart className="w-5 h-5" />
            </button>
            <Link href="/cart" className="text-text hover:text-primary transition-colors relative flex items-center">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="hidden md:flex items-center text-sm font-medium text-text hover:text-primary transition-colors cursor-pointer">
              <User className="w-5 h-5 mr-1" />
              Login / Register
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
