import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-cream">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-3xl">Safha</p>
          <p className="mt-1 font-urdu text-gold" dir="rtl">
            {SITE.nameUrdu}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            A curated bookshop for Karachi — authentic editions, considered taste, and delivery that
            respects your time.
          </p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/categories" className="hover:text-gold">Categories</Link></li>
            <li><Link href="/authors" className="hover:text-gold">Authors</Link></li>
            <li><Link href="/deals" className="hover:text-gold">Deals</Link></li>
            <li><Link href="/urdu" className="hover:text-gold">Urdu Books</Link></li>
            <li><Link href="/english" className="hover:text-gold">English Books</Link></li>
            <li><Link href="/search" className="hover:text-gold">Search</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Help</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/shipping" className="hover:text-gold">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-gold">Returns</Link></li>
            <li><Link href="/privacy" className="hover:text-gold">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/account/orders" className="hover:text-gold">Order history</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-[0.22em] text-gold">Visit & pay</h3>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">{SITE.address}</p>
          <p className="mt-2 text-sm text-cream/80">{SITE.hours}</p>
          <p className="mt-2 text-sm text-cream/80">{SITE.email}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-cream/50">We accept</p>
          <p className="mt-2 text-sm text-cream/80">Cash on Delivery · JazzCash · EasyPaisa · Visa · Mastercard</p>
          <div className="mt-4 flex gap-3 text-sm">
            <a href="https://instagram.com" className="hover:text-gold">Instagram</a>
            <a href="https://facebook.com" className="hover:text-gold">Facebook</a>
            <a href="https://wa.me/923008240190" className="hover:text-gold">WhatsApp</a>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Safha Bookshop, Karachi. All rights reserved.</p>
          <p>Made for readers in Pakistan.</p>
        </Container>
      </div>
    </footer>
  );
}
