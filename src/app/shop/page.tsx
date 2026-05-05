"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import { PRODUCTS, CATEGORIES, FABRICS } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Sarees");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All Sarees" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-text-muted flex items-center gap-2 border-b border-gray-200">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text">Shop</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden w-full flex justify-between items-center mb-4">
            <h1 className="text-2xl font-serif">All Products</h1>
            <Button variant="outline" size="sm" onClick={() => setShowFiltersMobile(!showFiltersMobile)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Sidebar */}
          <div className={`w-full md:w-64 flex-shrink-0 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text mb-6">Filter By</h2>
              
              {/* Categories */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4 cursor-pointer">
                  <h3 className="font-bold text-sm">CATEGORIES</h3>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="space-y-3">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                      />
                      <span className={`text-sm group-hover:text-primary transition-colors ${selectedCategory === cat ? 'text-primary font-medium' : 'text-text-muted'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div className="mb-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4 cursor-pointer">
                  <h3 className="font-bold text-sm">FABRIC</h3>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="space-y-3">
                  {FABRICS.map(fabric => (
                    <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded-sm bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-text-muted group-hover:text-primary transition-colors">
                        {fabric}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4 cursor-pointer">
                  <h3 className="font-bold text-sm">COLOR</h3>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['#8b0000', '#800080', '#006400', '#8b4513', '#ffa500', '#f5f5dc', '#000000'].map((color, i) => (
                     <button 
                       key={i} 
                       className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                       style={{ backgroundColor: color }}
                     ></button>
                  ))}
                  <button className="text-xs text-text-muted hover:text-primary mt-1">+ More</button>
                </div>
              </div>

              <Button fullWidth className="mt-4">APPLY FILTER</Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow w-full">
            <div className="hidden md:flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-serif text-text mb-2">Shop All Products</h1>
                <p className="text-text-muted text-sm italic">Discover our complete collection of elegant, traditional sarees.</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 text-sm text-text-muted">
              <span>Showing {filteredProducts.length} products</span>
              <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-sm">
                <span>Sort by:</span>
                <select className="bg-transparent font-medium text-text outline-none cursor-pointer">
                  <option>Featured</option>
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
