import Link from "next/link";
import { NewsletterSignupForm } from "@/components/layout/NewsletterSignupForm";

export default function Footer() {
  return (
    <footer className="bg-[#f1eee8] pt-16 pb-8 border-t border-neutral-200 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-neutral-900 mb-4">Policies</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/about">Contact Us</Link></li>
              <li><Link href="/about">Store Locator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li><Link href="/about">Shipping Policy</Link></li>
              <li><Link href="/about">Returns & Refund</Link></li>
              <li><Link href="/about">Privacy Policy</Link></li>
              <li><Link href="/about">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-neutral-900 mb-4">Get In Touch</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>+91 9121432255</li>
              <li>contact@anavasilks.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-neutral-900 mb-4">Become an Insider</h4>
            <p className="text-sm text-neutral-700 mb-4">
              Subscribe to receive special offers and news about our latest drops.
            </p>
            <NewsletterSignupForm variant="footer" />
          </div>
        </div>

        <div className="border-t border-neutral-300 pt-6 text-xs text-neutral-600 flex flex-col md:flex-row justify-between gap-2">
          <p>© AnavaSilks 2026</p>
          <p>Craft, Culture & Couture</p>
        </div>
      </div>
    </footer>
  );
}
