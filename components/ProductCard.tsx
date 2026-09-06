import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "@phosphor-icons/react/dist/ssr";

interface Size {
  label: string;
  available: boolean;
}

export interface ProductCardProps {
  slug: string;
  title: string;
  categoryTag?: string;
  stockTag?: string;

  priceMode: "display" | "enquire";
  price?: number;
  originalPrice?: number;

  inStock: boolean;
  stockCount?: number;
  sizes: Size[];

  image: string;
  badge?: string;
  /** Pass true for cards that are above the fold (first 4 visible) to avoid lazy-loading them */
  priority?: boolean;
}

export function ProductCard({
  slug,
  title,
  categoryTag,
  stockTag,
  priceMode,
  price,
  originalPrice,
  inStock,
  stockCount,
  sizes,
  image,
  badge,
  priority = false,
}: ProductCardProps) {
  const discountPercent =
    price && originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Determine if image is an external URL or a local /uploads/ path
  const isExternal = image.startsWith("http://") || image.startsWith("https://");
  const imageSrc = image || "/placeholder-jersey.jpg";

  return (
    <Link
      href={`/product/${slug}`}
      className="w-full flex flex-col bg-[#111111] rounded-xl overflow-hidden border border-border/10 group cursor-pointer hover:border-border/30 transition-colors"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-zinc-900">
        {image ? (
          isExternal ? (
            // For external URLs (e.g. Unsplash) use unoptimized img
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            // For local uploads — use Next.js Image for full optimization
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              quality={80}
            />
          )
        ) : (
          // Placeholder when no image
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <span className="text-zinc-700 text-xs font-medium uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {badge && (
            <div className="bg-black/80 backdrop-blur-md text-[#FFD700] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#FFD700]/30 rounded-sm">
              {badge}
            </div>
          )}
          {stockCount !== undefined && stockCount > 0 && stockCount <= 5 && (
            <div className="bg-[#4a0a0a]/90 backdrop-blur-md text-red-200 text-[10px] font-medium px-2 py-0.5 rounded-sm border border-red-900/50">
              Only {stockCount} left
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors hover:bg-black/70">
          <Heart size={16} weight="regular" className="text-white" />
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate pr-2">
            {categoryTag ? categoryTag.replace(/-/g, " ") : "STREETWEAR"}
          </span>
          <span
            className={`text-[10px] font-medium uppercase tracking-wider flex-shrink-0 ${
              inStock ? "text-[#00ff88]" : "text-red-500"
            }`}
          >
            {stockTag || (inStock ? "IN STOCK" : "OUT OF STOCK")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-white mb-4 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Size Preview (Non-interactive) */}
        {sizes.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-1.5 flex-wrap">
              {sizes.map((size) => (
                <div
                  key={size.label}
                  className={`
                    w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-sm border
                    ${
                      !size.available || !inStock
                        ? "bg-zinc-900/50 border-zinc-800/50 text-zinc-600/50"
                        : "bg-zinc-900 border-zinc-700 text-zinc-300"
                    }
                  `}
                >
                  {size.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Row */}
        <div className="flex items-end justify-between mt-auto">
          {priceMode === "display" ? (
            <div className="flex flex-col">
              {originalPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white">
                  ₹{price?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-bold text-sm text-white border border-white/20 bg-white/5 px-3 py-1.5 rounded-md">
              DM FOR PRICE
            </span>
          )}

          {priceMode === "display" && discountPercent > 0 && (
            <span className="text-[10px] font-bold text-[#00ff88] border border-[#00ff88]/30 bg-[#00ff88]/10 px-2 py-0.5 rounded-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
