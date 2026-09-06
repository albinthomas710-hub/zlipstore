import Link from "next/link";
import Image from "next/image";
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/10 bg-card py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-sm">
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center space-x-2">
            <Image src="/logo.jpg" alt="Zlip Store Logo" width={32} height={32} className="rounded-full object-cover" />
            <h3 className="text-xl font-bold tracking-tighter uppercase text-primary">Zlip Store</h3>
          </div>
          <p className="text-muted-foreground max-w-xs">
            Premium Products | Affordable Price. All India Delivery since 2025.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com/zlip_.store.__" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <InstagramLogo size={24} weight="light" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://wa.me/919446426981" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <WhatsappLogo size={24} weight="light" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Shop</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/category/latest-drops" className="hover:text-primary transition-colors">Latest Drops</Link></li>
            <li><Link href="/category/trending-now" className="hover:text-primary transition-colors">Trending Now</Link></li>
            <li><Link href="/category/special-edition" className="hover:text-primary transition-colors">Special Edition</Link></li>
            <li><Link href="/category/limited-stock" className="hover:text-primary transition-colors">Limited Stock</Link></li>
            <li><Link href="/category/club-player-edition" className="hover:text-primary transition-colors">Club Player Edition</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Help</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/panel" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Location</h4>
          <address className="text-muted-foreground not-italic leading-relaxed">
            Nilambur, Kerala<br/>
            India<br/><br/>
            Contact: <a href="tel:+919446426981" className="hover:text-primary transition-colors">+91 94464 26981</a>
          </address>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <h4 className="font-bold text-[#FFD700] uppercase tracking-wider">VIP Drop Group</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Join 200+ members receiving instant notifications before stock goes live on Instagram.
          </p>
          <a 
            href="https://chat.whatsapp.com/GLDxWUv3t5A9Owv6pSwsGC" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-md border border-[#25D366] bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-sm font-medium"
          >
            <WhatsappLogo size={18} weight="regular" />
            Join WhatsApp Group
          </a>
        </div>
      </div>

      {/* Legal & Copyright Bar */}
      <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-border/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Zlip Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="text-border">|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
