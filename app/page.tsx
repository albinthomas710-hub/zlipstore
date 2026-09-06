import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, ShoppingCart, WhatsappLogo, ShieldCheck, Truck, MapPin, ChatCircle } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zlip Store — Premium Jerseys & Streetwear | Nilambur, Kerala",
  description:
    "Buy premium football jerseys, streetwear, gadgets and accessories at affordable prices. Real Madrid, Barcelona, PSG jerseys & more. All India delivery. Order via WhatsApp.",
  alternates: { canonical: "https://zlipstore.in" },
  openGraph: {
    title: "Zlip Store — Premium Jerseys & Streetwear",
    description: "Premium jerseys at affordable prices. All India delivery. WhatsApp to order.",
    url: "https://zlipstore.in",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Zlip Store",
  url: "https://zlipstore.in",
  telephone: "+91-9633870945",
  description:
    "Premium jerseys, streetwear, and accessories at affordable prices. All India delivery from Nilambur, Kerala.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nilambur",
    addressRegion: "Kerala",
    postalCode: "679328",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "11.2837",
    longitude: "76.2248",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "09:00",
    closes: "21:00",
  },
  priceRange: "₹200 - ₹2000",
  sameAs: [
    "https://instagram.com/zlip_.store.__",
    "https://wa.me/919633870945",
  ],
};

export default async function Home() {
  const featuredProducts = await db.getFeaturedProducts();
  const categories = await db.getCategories();
  
  const trendingProducts = await db.getProductsByCategory("trending-now");
  const specialProducts = await db.getProductsByCategory("special-edition");
  const dynamicCategories = [
    { slug: "trending-now", products: trendingProducts },
    { slug: "special-edition", products: specialProducts }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Placeholder for background image/video */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
        
        <div className="container relative z-20 px-4 md:px-6 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">
            Your Next Fit<br />
            <span className="text-primary/90">Starts Here.</span>
          </h1>
          <p className="mx-auto max-w-[500px] text-zinc-300 md:text-lg">
            Premium jerseys and streetwear. Delivered anywhere in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/products" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-zinc-200"
            >
              Shop Collection
            </Link>
            <Link 
              href="/products?category=jersey" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 bg-black/40 backdrop-blur-md px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10"
            >
              Latest Jerseys
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <section className="w-full py-8 md:py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-5xl rounded-xl border border-border/20 bg-card overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 md:p-6 text-center sm:text-left">
                <ShieldCheck size={24} weight="regular" className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Secure Payments</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 md:p-6 text-center sm:text-left">
                <Truck size={24} weight="regular" className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Fast Dispatch</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 md:p-6 text-center sm:text-left">
                <MapPin size={24} weight="regular" className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Delivery Across India</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 md:p-6 text-center sm:text-left">
                <ChatCircle size={24} weight="regular" className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Latest Drops (Auto-Scrolling Marquee) */}
      <section className="w-full py-16 md:py-24 overflow-hidden border-b border-border/10">
        <div className="container px-4 md:px-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">Latest Drops</h2>
            <Link href="/products" className="text-sm flex items-center gap-1 text-primary hover:underline font-medium uppercase tracking-wider">
              View All Products
            </Link>
          </div>
        </div>
        
        {/* Products Container */}
        {featuredProducts.length > 0 ? (
          <div className="relative w-full flex overflow-hidden group py-4">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-4 md:gap-6 px-4 md:px-6 pr-[20vw] md:pr-[30vw]">
                  {featuredProducts.map((item) => (
                    <div key={`${arrayIndex}-${item.id}`} className="w-[280px] md:w-[320px] flex-shrink-0">
                      <ProductCard 
                        slug={item.slug}
                        title={item.name} 
                        categoryTag={item.category}
                        priceMode={item.priceMode}
                        price={item.price || undefined}
                        originalPrice={item.originalPrice || undefined}
                        inStock={item.inStock}
                        stockCount={item.stockCount || undefined}
                        sizes={item.sizes}
                        image={item.images[0] || ""} 
                        badge={item.badge}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container px-4 md:px-6 text-center text-zinc-500">
            No products available yet.
          </div>
        )}
      </section>

      {/* 4. Shop by Category / Collections */}
      <section className="w-full py-16 md:py-24 bg-zinc-950 border-t border-border/10">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase text-white">Collections</h2>
            <p className="max-w-[700px] text-zinc-400 md:text-lg">
              Find exactly what you are looking for by exploring our curated categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Latest Drops", href: "/category/latest-drops", image: "/collections/1.jpg" },
              { name: "🔥 Trending Now", href: "/category/trending-now", image: "/collections/2.jpg" },
              { name: "Special Edition", href: "/category/special-edition", image: "/collections/3.jpg" },
              { name: "Limited Stock", href: "/category/limited-stock", image: "/collections/4.webp" },
              { name: "Club Player Edition", href: "/category/club-player-edition", image: "/collections/5.webp" },
              { name: "All Products", href: "/products", image: "/collections/6.webp" },
            ].map((category, i) => (
              <Link 
                key={i} 
                href={category.href} 
                className="group relative overflow-hidden rounded-xl aspect-[4/3] md:aspect-auto md:h-[350px]"
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50" 
                />
                
                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
                    {category.name}
                  </h3>
                  <div className="bg-zinc-900/90 backdrop-blur-sm hover:bg-white hover:text-black transition-colors text-white border border-white/20 text-xs md:text-sm font-semibold uppercase tracking-wider px-6 py-3 rounded flex items-center gap-2 shadow-xl">
                    SHOP NOW
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dynamic Category Sections (e.g. Trending, Special Edition) */}
      {dynamicCategories.map(({ slug: catSlug, products }) => {
        if (products.length === 0) return null;
        
        const PREVIEW_LIMIT = 4;
        const hasMore = products.length > PREVIEW_LIMIT;
        const previewProducts = products.slice(0, PREVIEW_LIMIT);
        
        const tagName = catSlug === "trending-now" ? "🔥 Trending Now" : 
                       catSlug === "special-edition" ? "Special Edition" : catSlug;

        return (
          <section key={catSlug} className="w-full py-16 border-t border-border/10 bg-zinc-950">
            <div className="container px-4 md:px-6">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase text-white">
                    {tagName}
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1">
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {hasMore && (
                  <Link
                    href={`/category/${catSlug}`}
                    className="text-sm flex items-center gap-1.5 text-primary hover:underline font-medium uppercase tracking-wider"
                  >
                    View All <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {previewProducts.map((item) => (
                  <ProductCard
                    key={item.slug}
                    slug={item.slug}
                    title={item.name}
                    categoryTag={item.category}
                    priceMode={item.priceMode}
                    price={item.price || undefined}
                    originalPrice={item.originalPrice || undefined}
                    inStock={item.inStock}
                    stockCount={item.stockCount || undefined}
                    sizes={item.sizes}
                    image={item.images[0] || ""}
                    badge={item.badge}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Link
                    href={`/category/${catSlug}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border/30 bg-zinc-900 px-10 text-sm font-bold text-white uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                  >
                    View All {tagName}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* 5. CTA Section */}
      <section className="w-full py-24 bg-zinc-900 relative overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
            Secure Your Fit
          </h2>
          <p className="mx-auto max-w-[600px] text-zinc-400">
            Limited drops. Premium quality. Follow us on Instagram for the latest updates or WhatsApp us to order directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a 
              href="https://wa.me/919633870945" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-8 text-sm font-bold text-white shadow transition-colors hover:bg-[#20bd5a]"
            >
              <WhatsappLogo size={20} weight="fill" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
