import { ProductCard } from "@/components/ProductCard";
import { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const BASE_URL = "https://zlipstore.in";
const PAGE_SIZE = 16;

export const metadata: Metadata = {
  title: "All Products — Premium Jerseys & Streetwear",
  description:
    "Browse all premium jerseys, streetwear, gadgets and accessories at Zlip Store. Affordable prices. All India delivery. WhatsApp to order.",
  alternates: { canonical: `${BASE_URL}/products` },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const page = typeof params.page === "string" ? Math.max(1, parseInt(params.page) || 1) : 1;

  let allProducts = tag ? await db.getProductsByTag(tag) : await db.getProducts();

  // Sort by newest first
  allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const products = allProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageTitle = tag
    ? tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " Products"
    : "All Products";

  const buildPageUrl = (p: number) => {
    const q = new URLSearchParams();
    if (tag) q.set("tag", tag);
    if (p > 1) q.set("page", String(p));
    return `/products${q.toString() ? `?${q}` : ""}`;
  };

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-zinc-950 border-b border-border/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Shop</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-white capitalize">
            {pageTitle}
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Browse our complete collection of premium jerseys, streetwear, and exclusive drops.
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
            <p className="text-lg font-medium mb-2">No products found.</p>
            <Link href="/products" className="text-primary hover:underline text-sm">View all products</Link>
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
