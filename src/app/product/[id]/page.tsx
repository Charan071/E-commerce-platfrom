"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Minus, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/ui/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.color[0]?.name);
  const [activeTab, setActiveTab] = useState("DESCRIPTION");

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert("Added to cart!"); // Simple feedback, a toast would be better in production
  };

  return (
    <div className="bg-background pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-text-muted flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/collections" className="hover:text-primary transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 bg-white p-6 md:p-10 rounded-sm shadow-sm">
          {/* Images */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-20 flex-shrink-0">
              <div className="w-full aspect-[3/4] relative border-2 border-primary rounded-sm overflow-hidden cursor-pointer">
                <Image src={product.image} alt="thumb" fill sizes="80px" className="object-cover" />
              </div>
              <div className="w-full aspect-[3/4] relative border border-gray-200 rounded-sm overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                <Image src={product.image} alt="thumb 2" fill sizes="80px" className="object-cover" />
              </div>
            </div>
            <div className="flex-grow relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden">
              <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl md:text-4xl font-serif text-text font-medium leading-tight">
                {product.title}
              </h1>
              <button className="text-text-muted hover:text-primary transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-sm text-text-muted">Inclusive of all taxes</span>
            </div>

            <p className="text-text-muted mb-8 leading-relaxed">
              A classic Kanchipuram silk saree woven with intricate zari work and a rich pallu.
              Perfect for weddings and festive occasions.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <span className="w-24 text-sm font-bold uppercase tracking-wider text-text">Color:</span>
                <div className="flex gap-3">
                  {product.color.map((c) => (
                    <button 
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.name ? 'border-primary p-0.5' : 'border-transparent'}`}
                      title={c.name}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: c.hex }}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center text-sm">
                <span className="w-24 font-bold uppercase tracking-wider text-text">Material:</span>
                <span className="text-text-muted">{product.material}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <span className="w-24 font-bold uppercase tracking-wider text-text">Occasion:</span>
                <span className="text-text-muted">Wedding, Festive, Traditional</span>
              </div>

              <div className="flex items-center text-sm">
                <span className="w-24 font-bold uppercase tracking-wider text-text">In Stock:</span>
                <span className="text-primary font-medium">Only {product.stock} left</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-sm h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-text-muted hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 text-text-muted hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button size="lg" className="flex-1">
                Buy Now
              </Button>
            </div>

            {/* Features block */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-gray-100 text-center">
               <div>
                 <span className="block text-xl mb-1">🚚</span>
                 <p className="text-[10px] font-bold uppercase tracking-wide">Free Shipping</p>
               </div>
               <div>
                 <span className="block text-xl mb-1">🔄</span>
                 <p className="text-[10px] font-bold uppercase tracking-wide">Easy Returns</p>
               </div>
               <div>
                 <span className="block text-xl mb-1">🔒</span>
                 <p className="text-[10px] font-bold uppercase tracking-wide">Secure Payment</p>
               </div>
               <div>
                 <span className="block text-xl mb-1">💰</span>
                 <p className="text-[10px] font-bold uppercase tracking-wide">COD Available</p>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-20 bg-white p-6 rounded-sm shadow-sm">
          <div className="md:w-1/4 flex flex-col space-y-2 border-r border-gray-100 pr-6">
            {["DESCRIPTION", "DETAILS", "CARE INSTRUCTIONS", "SHIPPING & RETURNS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left text-sm font-bold tracking-wider py-3 px-4 transition-colors ${
                  activeTab === tab ? "text-primary bg-primary/5" : "text-text-muted hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="md:w-3/4 p-4 text-text-muted leading-relaxed text-sm">
            {activeTab === "DESCRIPTION" && (
              <div>
                <p className="mb-4">{product.description}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Pure {product.category}</li>
                  <li>Intricate Zari Weaving</li>
                  <li>Rich Contrast Pallu</li>
                  <li>Includes Unstitched Blouse Piece</li>
                </ul>
              </div>
            )}
            {activeTab !== "DESCRIPTION" && (
              <p>Content for {activeTab.toLowerCase()} goes here. This section provides additional details about the product&apos;s care instructions, shipping policies, or specific material details.</p>
            )}
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div>
             <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-text inline-flex items-center gap-4">
                <span className="h-px w-12 bg-primary/30"></span>
                You May Also Like
                <span className="h-px w-12 bg-primary/30"></span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
