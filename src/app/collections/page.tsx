"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CollectionsIndexPage() {
  const collections = [
    {
      title: "The Bridal Edit",
      description: "Magnificent weaves for your special day.",
      image: "/images/saree-1.png",
      link: "/shop"
    },
    {
      title: "Festive Elegance",
      description: "Vibrant colors and rich zari for celebrations.",
      image: "/images/saree-2.png",
      link: "/shop"
    },
    {
      title: "Everyday Classics",
      description: "Lightweight and comfortable pure silk.",
      image: "/images/saree-3.png",
      link: "/shop"
    },
    {
      title: "The Heritage Collection",
      description: "Reviving centuries-old vintage motifs.",
      image: "/images/saree-4.png",
      link: "/shop"
    }
  ];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-text-muted flex items-center gap-2 border-b border-gray-200">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text">Collections</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif text-text mb-6">Our Collections</h1>
          <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            Browse our carefully curated stories. Each collection is a testament to the versatility and timeless beauty of Indian handlooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <Link 
              href={collection.link} 
              key={index}
              className="group relative h-[500px] md:h-[600px] w-full overflow-hidden block"
            >
              <Image 
                src={collection.image} 
                alt={collection.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">{collection.title}</h2>
                <p className="text-white/80 mb-6 text-sm md:text-base">{collection.description}</p>
                <span className="inline-block border-b border-white text-white pb-1 text-sm font-bold tracking-widest uppercase hover:text-primary hover:border-primary transition-colors">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
