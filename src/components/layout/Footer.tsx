import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-serif font-bold text-primary mb-4">AnavaSilks</h3>
            <p className="text-text-muted text-sm mb-6">
              Timeless weaves that tell stories of heritage, grace and elegance.
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">f</div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">in</div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">x</div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-text mb-4 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/collections" className="text-text-muted hover:text-primary text-sm transition-colors">All Sarees</Link></li>
              <li><Link href="/collections" className="text-text-muted hover:text-primary text-sm transition-colors">Kanchipuram Silk</Link></li>
              <li><Link href="/collections" className="text-text-muted hover:text-primary text-sm transition-colors">Banarasi Silk</Link></li>
              <li><Link href="/collections" className="text-text-muted hover:text-primary text-sm transition-colors">Tussar Silk</Link></li>
              <li><Link href="/collections" className="text-text-muted hover:text-primary text-sm transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-text mb-4 uppercase text-sm tracking-wider">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Return Policy</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Track Order</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold text-text mb-4 uppercase text-sm tracking-wider">About Us</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Our Story</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Craftsmanship</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="text-text-muted hover:text-primary text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-gray-200">
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="font-bold">Free Shipping</p>
              <p className="text-text-muted text-xs">On orders above ₹5,000</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-bold">Easy Returns</p>
              <p className="text-text-muted text-xs">Within 7 days</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-bold">Secure Payment</p>
              <p className="text-text-muted text-xs">100% Protected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-bold">COD Available</p>
              <p className="text-text-muted text-xs">Pay on delivery</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted">
          <p>© 2024 AnavaSilks. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
