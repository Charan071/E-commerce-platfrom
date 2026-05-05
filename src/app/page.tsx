import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";

export default function Home() {
  const bestSellers = PRODUCTS.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px]">
        <Link href="/collections" className="absolute inset-0 w-full h-full block group overflow-hidden">
          <Image
            src="/images/hero.png"
            alt="Summer 2024 New Collection"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        </Link>
      </section>

      {/* Shop by Category */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-text inline-flex items-center gap-4">
            <span className="h-px w-12 bg-primary/30"></span>
            Shop by Category
            <span className="h-px w-12 bg-primary/30"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Cards */}
          {[
            { name: "SAMUDRIKA PATTU", image: "/images/cat-1.png" },
            { name: "KALYANA PATTU", image: "/images/cat-2.png" },
            { name: "VASTRAKALA PATTU", image: "/images/cat-3.png" }
          ].map((cat, i) => (
            <Link href="/collections" key={i} className="group relative h-[450px] overflow-hidden flex items-end justify-center pb-8">
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="relative z-10 text-center w-full px-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-white text-2xl font-serif font-bold mb-4 tracking-wider">{cat.name}</h3>
                <Button variant="secondary" className="bg-white text-text hover:bg-gray-100 uppercase tracking-widest text-xs px-8">
                  Shop the latest
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/4 pt-8">
              <h2 className="text-4xl font-serif text-text mb-6">Best Selling<br />For Woman&apos;s</h2>
              <p className="text-text-muted mb-8 leading-relaxed">
                Discover our best-selling sarees for every occasion, blending traditional craftsmanship with timeless grace.
              </p>
              <Link href="/collections">
                <Button className="px-8">SEE MORE &rarr;</Button>
              </Link>
            </div>
            
            <div className="lg:w-3/4 relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-text hover:text-primary transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x pb-4">
                {bestSellers.map((product) => (
                  <div key={product.id} className="min-w-[280px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-text hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Blocks */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[500px]">
          <Image 
            src="/images/saree-2.png" 
            alt="Weaving process" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="bg-background flex flex-col justify-center px-12 lg:px-24 h-[500px]">
          <h2 className="text-4xl lg:text-5xl font-serif text-text mb-6 leading-tight">
            We craft our silk sarees using pure, natural fibers
          </h2>
          <p className="text-text-muted text-lg mb-8 leading-relaxed">
            Ensuring an authentic and sustainable weaving process that embraces the beauty of nature.
          </p>
          <div>
            <Button>LEARN MORE &rarr;</Button>
          </div>
        </div>
      </section>

      <section className="w-full relative py-24 bg-primary text-white text-center">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/saree-3.png" 
            alt="Texture pattern" 
            fill 
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Sculpting Elegance</h2>
          <p className="text-xl font-light mb-8 opacity-90">Unveiling the Timeless Artistry of Kanchipuram Silk Sarees</p>
          <button className="inline-flex items-center gap-3 hover:text-white/80 transition-colors uppercase tracking-widest text-sm font-medium">
            <span className="w-12 h-12 rounded-full border border-white flex items-center justify-center">▶</span>
            Watch Video
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-serif text-text mb-4">Subscribe to our newsletter<br/>and get updates on new arrival</h2>
            <p className="text-text-muted mb-8 text-sm leading-relaxed">
              Stay in the loop! Subscribe to our newsletter for the latest updates on new arrivals, exclusive collections, and special offers. Elevate your style with timely fashion updates delivered to your inbox.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="flex-grow border border-gray-300 rounded-l-sm px-4 py-3 text-sm focus:outline-none focus:border-primary"
                required
              />
              <Button type="submit" className="rounded-l-none rounded-r-sm px-8">SUBSCRIBE</Button>
            </form>
          </div>
          <div className="lg:w-2/3 flex gap-2 overflow-hidden">
            {/* Instagram feed mock images */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative w-full aspect-[3/4] flex-shrink-0 min-w-[120px] lg:min-w-0">
                <Image 
                  src={PRODUCTS[i % PRODUCTS.length].image} 
                  alt="Instagram feed" 
                  fill 
                  sizes="(max-width: 1024px) 120px, 20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
