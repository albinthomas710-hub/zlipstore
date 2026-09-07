import { ProductCard } from "@/components/ProductCard";
import { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const BASE_URL = "https://zlipstore.in";
const PAGE_SIZE = 16;

const CATEGORY_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  "latest-drops": {
    title: "Latest Drops — New Arrivals",
    description:
      "Shop the latest jersey and streetwear drops at Zlip Store. Fresh new arrivals, limited edition pieces, and trending styles. All India delivery. Order via WhatsApp.",
    keywords: ["latest jersey drops", "new jersey arrivals india", "new streetwear drops", "latest football jersey"],
  },
  "trending-now": {
    title: "Trending Now — Most Popular",
    description:
      "Shop our most popular and trending jerseys and streetwear at Zlip Store. Top-selling football jerseys, premium quality at affordable prices. All India delivery.",
    keywords: ["trending jerseys india", "popular football jersey", "best selling jersey", "trending streetwear"],
  },
  "footwears": {
    title: "Footwears — Exclusive Pieces",
    description:
      "Exclusive special edition jerseys and streetwear at Zlip Store. Rare collector pieces, unique designs, premium quality. Limited availability. Order via WhatsApp.",
    keywords: ["special edition jersey", "exclusive jersey india", "collector jersey", "rare football jersey"],
  },
  "gadgets": {
    title: "Gadgets — Grab Before It's Gone",
    description:
      "Last chance to grab limited stock jerseys and streetwear at Zlip Store. Very few pieces left. Premium quality at unbeatable prices. All India delivery.",
    keywords: ["limited stock jersey", "last chance jersey", "few pieces left jersey india", "scarce jersey"],
  },
  "clothes": {
    title: "Club & Player Edition — Official Style",
    description:
      "Shop club and player edition jerseys at Zlip Store. Real Madrid, Barcelona, PSG, Man City and more. Mbappe, Vinicius, Bellingham jerseys available. All India delivery.",
    keywords: [
      "club jersey india",
      "player edition jersey",
      "real madrid jersey india",
      "barcelona jersey india",
      "mbappe jersey",
      "psg jersey india",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  const formattedName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const title = meta?.title || `${formattedName} Collection`;
  const description =
    meta?.description ||
    `Shop our ${formattedName} collection at Zlip Store. Premium quality at affordable prices. All India delivery.`;
  const keywords = meta?.keywords || ["jersey india", "streetwear", "zlip store"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | Zlip Store`,
      description,
      url: `${BASE_URL}/category/${slug}`,
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${formattedName} — Zlip Store` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Zlip Store`,
      description,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `${BASE_URL}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1") || 1);

  const formattedTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const meta = CATEGORY_META[slug];

  // "latest-drops" and "trending-now" are tag-based sections, not product categories.
  // They pull products tagged "new-arrival" or "trending" regardless of product type.
  // Product type categories (clothes, gadgets, footwears) filter by category field.
  const TAG_BASED_SECTIONS: Record<string, string> = {
    "latest-drops": "new-arrival",
    "trending-now": "trending",
  };

  const tagForSection = TAG_BASED_SECTIONS[slug];
  const allProducts = tagForSection
    ? await db.getProductsByTag(tagForSection)
    : await db.getProductsByCategory(slug);
  allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const products = allProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const buildPageUrl = (p: number) =>
    `/category/${slug}${p > 1 ? `?page=${p}` : ""}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${BASE_URL}/products` },
      { "@type": "ListItem", position: 3, name: formattedTitle, item: `${BASE_URL}/category/${slug}` },
    ],
  };

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <div className="w-full bg-zinc-950 border-b border-border/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Collection</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white">
            {formattedTitle}
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            {meta?.description?.split(".")[0] || `Explore all exclusive pieces in our ${formattedTitle} collection`}.
          </p>
          {totalProducts > 0 && (
            <p className="mt-2 text-zinc-600 text-sm">
              {totalProducts} product{totalProducts !== 1 ? "s" : ""}
              {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
            </p>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center text-zinc-500 py-24">
            <p className="text-lg font-medium mb-4">No products in this collection yet.</p>
            <Link href="/products" className="text-primary hover:underline text-sm">Browse all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                title={product.name}
                categoryTag={product.category}
                priceMode={product.priceMode}
                price={product.price || undefined}
                originalPrice={product.originalPrice || undefined}
                inStock={product.inStock}
                stockCount={product.stockCount || undefined}
                sizes={product.sizes}
                image={product.images[0] || ""}
                badge={product.badge}
                priority={i < 4}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            {currentPage > 1 ? (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/30 bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft size={14} /> Previous
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/10 bg-zinc-950 text-sm font-medium text-zinc-700 cursor-not-allowed">
                <ArrowLeft size={14} /> Previous
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-zinc-600">…</span>
                  ) : (
                    <Link
                      key={item}
                      href={buildPageUrl(item as number)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        item === currentPage
                          ? "bg-white text-black"
                          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-border/20"
                      }`}
                    >
                      {item}
                    </Link>
                  )
                )}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/30 bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Next <ArrowRight size={14} />
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border/10 bg-zinc-950 text-sm font-medium text-zinc-700 cursor-not-allowed">
                Next <ArrowRight size={14} />
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
