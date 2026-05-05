import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-black overflow-hidden">
        <Image
          src="/images/saree-2.png" // using a beautiful saree image as background
          alt="Weaving loom"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          priority
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Our Story</h1>
          <p className="text-xl md:text-2xl font-light tracking-wide uppercase">Preserving the legacy of Kanchipuram</p>
        </div>
      </section>

      {/* Content Section 1 */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-serif text-text mb-6">A Journey Woven in Time</h2>
            <p className="text-text-muted leading-relaxed mb-6 text-lg">
              AnavaSilks was born from a deep-rooted passion for India&apos;s rich textile heritage. For generations, the weavers of Kanchipuram have translated myth, nature, and art into intricate zari motifs on pure mulberry silk. 
            </p>
            <p className="text-text-muted leading-relaxed text-lg">
              We started with a simple mission: to preserve this ancient craft while making it accessible to the modern woman. Every saree in our collection is not just a piece of clothing, but a heirloom that carries the soul of its creator.
            </p>
          </div>
          <div className="md:w-1/2 relative aspect-[4/5] w-full rounded-sm overflow-hidden shadow-lg">
            <Image 
              src="/images/saree-1.png" 
              alt="Artisan at work" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif text-text mb-8">Our Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text">Pure & Natural</h3>
              <p className="text-text-muted">We use only 100% pure natural silk fibers and authentic gold/silver zari, ensuring uncompromising quality.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="text-2xl">🤲</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text">Handwoven Heritage</h3>
              <p className="text-text-muted">By partnering directly with master weavers, we ensure fair wages and keep the traditional handloom alive.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text">Timeless Elegance</h3>
              <p className="text-text-muted">Our designs marry traditional temple borders with contemporary color palettes for the modern wardrobe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-serif mb-6">Experience the Magic</h2>
          <p className="text-lg opacity-90 mb-10 font-light">
            Drape yourself in a legacy that has been perfected over centuries. Discover your perfect AnavaSilks saree today.
          </p>
          <Link href="/collections">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-12">
              Explore Collections
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
